import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contracts = [
  {
    name: "TranscriptRegistry",
    address: "0x742d35Cc6634C0532925a3b8D7...890",
    status: "active",
    actions: [
      { label: "Register Student", action: "registerStudent", color: "teal" },
      { label: "Issue Transcript", action: "issueTranscript", color: "orange" },
    ]
  },
  {
    name: "UniversityVerifier", 
    address: "0x1b4d72Ac7534D8593525a4c9E6...123",
    status: "active",
    actions: [
      { label: "Verify Uni", action: "verifyUniversity", color: "blue" },
      { label: "Validate", action: "validateTranscript", color: "purple" },
    ]
  }
];

export default function SmartContracts() {
  const { toast } = useToast();

  const handleContractAction = async (action: string) => {
    try {
      let endpoint = '';
      let data = {};
      
      switch (action) {
        case 'registerStudent':
          endpoint = '/api/blockchain/register-student';
          data = { 
            studentAddress: `0x${Math.random().toString(16).slice(2, 42)}`, 
            hash: `0x${Math.random().toString(16).slice(2, 66)}`
          };
          break;
        case 'issueTranscript':
          endpoint = '/api/blockchain/issue-transcript';
          data = { 
            studentAddress: `0x${Math.random().toString(16).slice(2, 42)}`, 
            transcriptHash: `0x${Math.random().toString(16).slice(2, 66)}`
          };
          break;
        default:
          toast({
            title: "Action Triggered",
            description: `${action} interaction initiated`,
          });
          return;
      }

      const response = await apiRequest('POST', endpoint, data);
      const result = await response.json();
      
      toast({
        title: "Success",
        description: `Transaction hash: ${result.transactionHash}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute smart contract action",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-morphism border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Smart Contracts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract.name} className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white" data-testid={`text-contract-${contract.name.toLowerCase()}`}>
                  {contract.name}
                </h4>
                <Badge 
                  variant="secondary" 
                  className="bg-green-900/30 text-green-400"
                  data-testid={`badge-status-${contract.name.toLowerCase()}`}
                >
                  Active
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mb-3" data-testid={`text-address-${contract.name.toLowerCase()}`}>
                {contract.address}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {contract.actions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    className={`bg-${action.color}-500/20 border-${action.color}-500 text-${action.color}-400 hover:bg-${action.color}-500/30 transition-colors`}
                    onClick={() => handleContractAction(action.action)}
                    data-testid={`button-${action.action.toLowerCase()}`}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
