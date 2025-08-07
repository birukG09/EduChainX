import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUniversitySchema, type University } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type UniversityFormData = typeof insertUniversitySchema._type;

export default function Universities() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: universities = [], isLoading } = useQuery<University[]>({
    queryKey: ['/api/universities'],
  });

  const form = useForm<UniversityFormData>({
    resolver: zodResolver(insertUniversitySchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      website: "",
      walletAddress: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: UniversityFormData) => {
      return await apiRequest('POST', '/api/universities', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
      toast({
        title: "Success",
        description: "University added successfully",
      });
      setIsCreateOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to add university",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('PATCH', `/api/universities/${id}/verify`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
      toast({
        title: "Success",
        description: "University verified successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to verify university", 
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UniversityFormData) => {
    createMutation.mutate(data);
  };

  return (
    <DashboardLayout title="University Management" subtitle="Manage and verify university registrations">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-400">
          Total universities: {universities.length} | Verified: {universities.filter(u => u.verified).length}
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" data-testid="button-add-university">
              <i className="fas fa-plus mr-2"></i>
              Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New University</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-700 border-slate-600" data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="bg-slate-700 border-slate-600" data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" className="bg-slate-700 border-slate-600" data-testid="input-website" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-700 border-slate-600" data-testid="input-wallet" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600" 
                  disabled={createMutation.isPending}
                  data-testid="button-submit-university"
                >
                  {createMutation.isPending ? "Adding..." : "Add University"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Universities Grid */}
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
        ) : universities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-university text-slate-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-medium text-slate-400 mb-2">No universities found</h3>
            <p className="text-slate-500">Add your first university to get started</p>
          </div>
        ) : (
          universities.map((university) => (
            <Card key={university.id} className="bg-slate-800 border-slate-700" data-testid={`card-university-${university.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white truncate" data-testid={`text-name-${university.id}`}>
                    {university.name}
                  </CardTitle>
                  <Badge 
                    variant={university.verified ? "secondary" : "outline"}
                    className={university.verified ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}
                    data-testid={`badge-status-${university.id}`}
                  >
                    {university.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Contact Email</p>
                    <p className="text-white" data-testid={`text-email-${university.id}`}>{university.contactEmail || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-400">Website</p>
                    <p className="text-white truncate" data-testid={`text-website-${university.id}`}>
                      {university.website || 'Not provided'}
                    </p>
                  </div>
                  
                  {university.walletAddress && (
                    <div>
                      <p className="text-sm text-slate-400">Wallet Address</p>
                      <p className="text-xs font-mono text-slate-300 truncate" data-testid={`text-wallet-${university.id}`}>
                        {university.walletAddress}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-slate-400">Joined</p>
                    <p className="text-white" data-testid={`text-joined-${university.id}`}>
                      {new Date(university.createdAt!).toLocaleDateString()}
                    </p>
                  </div>

                  {!university.verified && (
                    <Button
                      onClick={() => verifyMutation.mutate(university.id)}
                      disabled={verifyMutation.isPending}
                      className="w-full bg-teal-500 hover:bg-teal-600 mt-4"
                      data-testid={`button-verify-${university.id}`}
                    >
                      {verifyMutation.isPending ? "Verifying..." : "Verify University"}
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
