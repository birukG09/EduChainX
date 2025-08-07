import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTranscriptSchema, type Transcript } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const transcriptFormSchema = insertTranscriptSchema.extend({
  issueDate: z.string().min(1, "Issue date is required"),
});

type TranscriptFormData = z.infer<typeof transcriptFormSchema>;

export default function Transcripts() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transcripts = [], isLoading } = useQuery<Transcript[]>({
    queryKey: ['/api/transcripts'],
  });

  const form = useForm<TranscriptFormData>({
    resolver: zodResolver(transcriptFormSchema),
    defaultValues: {
      studentId: "",
      universityId: "",
      studentName: "",
      degree: "",
      issueDate: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TranscriptFormData) => {
      const response = await apiRequest('POST', '/api/transcripts', {
        ...data,
        issueDate: new Date(data.issueDate).toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transcripts'] });
      toast({
        title: "Success",
        description: "Transcript created successfully",
      });
      setIsCreateOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create transcript",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/transcripts/${id}/verify`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transcripts'] });
      toast({
        title: "Success",
        description: "Transcript verified successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to verify transcript",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TranscriptFormData) => {
    createMutation.mutate(data);
  };

  return (
    <DashboardLayout title="Transcript Management" subtitle="Issue and verify academic transcripts">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-400">
          Total transcripts: {transcripts.length}
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600" data-testid="button-create-transcript">
              <i className="fas fa-plus mr-2"></i>
              Issue Transcript
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Issue New Transcript</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-700 border-slate-600" data-testid="input-student-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-700 border-slate-600" data-testid="input-degree" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-700 border-slate-600" data-testid="input-student-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="universityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University ID</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-700 border-slate-600" data-testid="input-university-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="bg-slate-700 border-slate-600" data-testid="input-issue-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-teal-500 hover:bg-teal-600" 
                  disabled={createMutation.isPending}
                  data-testid="button-submit-transcript"
                >
                  {createMutation.isPending ? "Creating..." : "Issue Transcript"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transcripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-600 rounded mb-2"></div>
                <div className="h-3 bg-slate-600 rounded mb-4"></div>
                <div className="h-8 bg-slate-600 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : transcripts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-certificate text-slate-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-medium text-slate-400 mb-2">No transcripts found</h3>
            <p className="text-slate-500">Issue your first transcript to get started</p>
          </div>
        ) : (
          transcripts.map((transcript) => (
            <Card key={transcript.id} className="bg-slate-800 border-slate-700" data-testid={`card-transcript-${transcript.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white truncate" data-testid={`text-degree-${transcript.id}`}>
                    {transcript.degree}
                  </CardTitle>
                  <Badge 
                    variant={transcript.verified ? "secondary" : "outline"}
                    className={transcript.verified ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}
                    data-testid={`badge-status-${transcript.id}`}
                  >
                    {transcript.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Student</p>
                    <p className="text-white font-medium" data-testid={`text-student-${transcript.id}`}>{transcript.studentName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-400">Issue Date</p>
                    <p className="text-white" data-testid={`text-issue-date-${transcript.id}`}>
                      {new Date(transcript.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {transcript.blockTxn && (
                    <div>
                      <p className="text-sm text-slate-400">Transaction Hash</p>
                      <p className="text-xs font-mono text-slate-300 truncate" data-testid={`text-hash-${transcript.id}`}>
                        {transcript.blockTxn}
                      </p>
                    </div>
                  )}

                  {!transcript.verified && (
                    <Button
                      onClick={() => verifyMutation.mutate(transcript.id)}
                      disabled={verifyMutation.isPending}
                      className="w-full bg-teal-500 hover:bg-teal-600 mt-4"
                      data-testid={`button-verify-${transcript.id}`}
                    >
                      {verifyMutation.isPending ? "Verifying..." : "Verify Transcript"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
