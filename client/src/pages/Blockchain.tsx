import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const studentRegistrationSchema = z.object({
  studentAddress: z.string().min(1, "Student address is required"),
  hash: z.string().min(1, "Hash is required"),
});

const transcriptIssuanceSchema = z.object({
  studentAddress: z.string().min(1, "Student address is required"), 
  transcriptHash: z.string().min(1, "Transcript hash is required"),
});

type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>;
type TranscriptIssuanceData = z.infer<typeof transcriptIssuanceSchema>;

export default function Blockchain() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const { toast } = useToast();

  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['/api/audit-logs'],
  });

  const registerForm = useForm<StudentRegistrationData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      studentAddress: "",
      hash: "",
    },
  });

  const issueForm = useForm<TranscriptIssuanceData>({
    resolver: zodResolver(transcriptIssuanceSchema),
    defaultValues: {
      studentAddress: "",
      transcriptHash: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: StudentRegistrationData) => {
      const response = await apiRequest('POST', '/api/blockchain/register-student', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Student Registered",
        description: `Transaction: ${data.transactionHash}`,
      });
      setIsRegisterOpen(false);
      registerForm.reset();
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to register student on blockchain",
        variant: "destructive",
      });
    },
  });

  const issueMutation = useMutation({
    mutationFn: async (data: TranscriptIssuanceData) => {
      const response = await apiRequest('POST', '/api/blockchain/issue-transcript', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Transcript Issued",
        description: `Transaction: ${data.transactionHash}`,
      });
      setIsIssueOpen(false);
      issueForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to issue transcript",
        variant: "destructive",
      });
    },
  });

  // Mock blockchain status data
  const blockchainStatus = {
    network: "Polygon Testnet",
    gasPrice: "23 Gwei",
    blockNumber: 18245672,
    connectedWallets: 3,
    totalTransactions: 1247,
    contractBalance: "2.45 MATIC",
  };

  const smartContracts = [
    {
      name: "TranscriptRegistry",
      address: "0x742d35Cc6634C0532925a3b8D7890a1b2c3d4e5f",
      status: "active",
      deployedAt: "2024-01-15",
      gasUsed: "2,450,000",
      functions: ["registerStudent", "issueTranscript", "validateTranscript"]
    },
    {
      name: "UniversityVerifier",
      address: "0x1b4d72Ac7534D8593525a4c9E6123a7b8c9d0e1f",
      status: "active",
      deployedAt: "2024-01-15",
      gasUsed: "1,890,000",
      functions: ["verifyUniversity", "addUniversity", "revokeUniversity"]
    },
    {
      name: "AccessControl",
      address: "0x9f8e7d6c5b4a3920817263548596a5b4c3d2e1f0",
      status: "active",
      deployedAt: "2024-01-15",
      gasUsed: "890,000",
      functions: ["grantRole", "revokeRole", "hasRole"]
    }
  ];

  const recentTransactions = auditLogs
    .filter(log => log.eventType.startsWith('blockchain_'))
    .slice(0, 10)
    .map(log => ({
      hash: log.metadata?.transactionHash || `0x${Math.random().toString(16).slice(2, 42)}`,
      type: log.eventType.replace('blockchain_', ''),
      timestamp: log.timestamp!,
      gasUsed: log.metadata?.gasUsed || Math.floor(Math.random() * 100000) + 21000,
      status: log.metadata?.status || 'success'
    }));

  return (
    <DashboardLayout title="Blockchain Management" subtitle="Monitor smart contracts, transactions, and network status">
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700" data-testid="tab-overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="contracts" className="data-[state=active]:bg-slate-700" data-testid="tab-contracts">
            Smart Contracts
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-slate-700" data-testid="tab-transactions">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-slate-700" data-testid="tab-deploy">
            Deploy & Interact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Network Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Network Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network:</span>
                    <span className="text-white" data-testid="text-network">{blockchainStatus.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gas Price:</span>
                    <span className="text-white" data-testid="text-gas-price">{blockchainStatus.gasPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Block:</span>
                    <span className="text-white" data-testid="text-block-number">{blockchainStatus.blockNumber.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contract Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Contracts:</span>
                    <span className="text-white" data-testid="text-active-contracts">{smartContracts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Transactions:</span>
                    <span className="text-white" data-testid="text-total-transactions">{blockchainStatus.totalTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Balance:</span>
                    <span className="text-white" data-testid="text-contract-balance">{blockchainStatus.contractBalance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-teal-500 hover:bg-teal-600" data-testid="button-register-student">
                        <i className="fas fa-user-plus mr-2"></i>
                        Register Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Register Student on Blockchain</DialogTitle>
                      </DialogHeader>
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="studentAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Wallet Address</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="0x..." className="bg-slate-700 border-slate-600" data-testid="input-student-address" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="hash"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Data Hash</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="0x..." className="bg-slate-700 border-slate-600" data-testid="input-student-hash" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={registerMutation.isPending} data-testid="button-submit-register">
                            {registerMutation.isPending ? "Registering..." : "Register Student"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600" data-testid="button-issue-transcript">
                        <i className="fas fa-certificate mr-2"></i>
                        Issue Transcript
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Issue Transcript on Blockchain</DialogTitle>
                      </DialogHeader>
                      <Form {...issueForm}>
                        <form onSubmit={issueForm.handleSubmit((data) => issueMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={issueForm.control}
                            name="studentAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Wallet Address</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="0x..." className="bg-slate-700 border-slate-600" data-testid="input-issue-student-address" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={issueForm.control}
                            name="transcriptHash"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Transcript Hash</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="0x..." className="bg-slate-700 border-slate-600" data-testid="input-transcript-hash" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={issueMutation.isPending} data-testid="button-submit-issue">
                            {issueMutation.isPending ? "Issuing..." : "Issue Transcript"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {smartContracts.map((contract) => (
              <Card key={contract.name} className="bg-slate-800 border-slate-700" data-testid={`card-contract-${contract.name.toLowerCase()}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white">{contract.name}</CardTitle>
                    <Badge className="bg-green-900/30 text-green-400 border-green-700">
                      {contract.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-400">Contract Address</p>
                        <p className="text-xs font-mono text-slate-300 break-all" data-testid={`text-address-${contract.name.toLowerCase()}`}>
                          {contract.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Deployed</p>
                        <p className="text-white" data-testid={`text-deployed-${contract.name.toLowerCase()}`}>
                          {contract.deployedAt}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Gas Used</p>
                        <p className="text-white" data-testid={`text-gas-used-${contract.name.toLowerCase()}`}>
                          {contract.gasUsed}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Available Functions</p>
                      <div className="flex flex-wrap gap-2">
                        {contract.functions.map((func) => (
                          <Badge key={func} variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Recent Blockchain Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-600 rounded mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-link text-slate-600 text-3xl mb-2"></i>
                  <p className="text-slate-400">No blockchain transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      data-testid={`transaction-${index}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-cyan-900/30 rounded-full flex items-center justify-center">
                          <i className="fas fa-link text-cyan-400"></i>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-mono text-sm text-white" data-testid={`text-hash-${index}`}>
                              {tx.hash}
                            </p>
                            <Badge 
                              variant={tx.status === 'success' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {tx.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 capitalize" data-testid={`text-type-${index}`}>
                            {tx.type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-500" data-testid={`text-timestamp-${index}`}>
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white" data-testid={`text-gas-${index}`}>
                          {tx.gasUsed.toLocaleString()} gas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Contract Deployment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h4 className="font-medium text-white mb-2">Deploy New Contract</h4>
                  <p className="text-sm text-slate-400 mb-4">
                    Deploy smart contracts to the blockchain network
                  </p>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600" data-testid="button-deploy-contract">
                    <i className="fas fa-rocket mr-2"></i>
                    Deploy Contract
                  </Button>
                </div>
                
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h4 className="font-medium text-white mb-2">Upgrade Contract</h4>
                  <p className="text-sm text-slate-400 mb-4">
                    Upgrade existing contracts with new functionality
                  </p>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-upgrade-contract">
                    <i className="fas fa-upload mr-2"></i>
                    Upgrade Contract
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Contract Interaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="contract-address" className="text-slate-300">Contract Address</Label>
                  <Input
                    id="contract-address"
                    placeholder="0x..."
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-contract-address"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="function-name" className="text-slate-300">Function Name</Label>
                  <Input
                    id="function-name"
                    placeholder="functionName"
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-function-name"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="parameters" className="text-slate-300">Parameters (JSON)</Label>
                  <Input
                    id="parameters"
                    placeholder='["param1", "param2"]'
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-parameters"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-teal-500 hover:bg-teal-600" data-testid="button-call-function">
                    <i className="fas fa-play mr-2"></i>
                    Call Function
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700" data-testid="button-estimate-gas">
                    <i className="fas fa-calculator mr-2"></i>
                    Estimate Gas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
