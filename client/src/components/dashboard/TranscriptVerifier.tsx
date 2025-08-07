import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TranscriptVerificationResult } from "@/types";

export default function TranscriptVerifier() {
  const [hash, setHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<TranscriptVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!hash.trim()) {
      toast({
        title: "Error",
        description: "Please enter a transaction hash or QR code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/transcripts/verify', { hash });
      const result = await response.json();
      setVerificationResult(result);
      
      toast({
        title: "Verification Complete",
        description: result.verified ? "Transcript successfully verified!" : "Transcript verification failed",
        variant: result.verified ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify transcript",
        variant: "destructive",
      });
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-morphism border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Transcript Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-slate-300 mb-2">
            Transaction Hash or QR Code
          </Label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="0x1234...abcd"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              data-testid="input-hash"
            />
            <Button 
              variant="secondary" 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              data-testid="button-qr-scan"
            >
              <i className="fas fa-qrcode"></i>
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleVerify}
          disabled={isLoading || !hash.trim()}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          data-testid="button-verify"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Verifying...
            </>
          ) : (
            <>
              <i className="fas fa-check-circle mr-2"></i>
              Verify Transcript
            </>
          )}
        </Button>

        {verificationResult && (
          <div className={`p-4 rounded-lg border ${
            verificationResult.verified 
              ? 'bg-green-900/30 border-green-700' 
              : 'bg-red-900/30 border-red-700'
          }`} data-testid="verification-result">
            <div className="flex items-center space-x-2 mb-3">
              <i className={`fas ${verificationResult.verified ? 'fa-check-circle text-green-400' : 'fa-times-circle text-red-400'}`}></i>
              <span className={`font-semibold ${verificationResult.verified ? 'text-green-400' : 'text-red-400'}`}>
                {verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}
              </span>
            </div>
            
            {verificationResult.verified && (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <span className="text-white" data-testid="text-student">{verificationResult.student}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">University:</span>
                    <span className="text-white" data-testid="text-university">{verificationResult.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Degree:</span>
                    <span className="text-white" data-testid="text-degree">{verificationResult.degree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Issue Date:</span>
                    <span className="text-white" data-testid="text-issue-date">{verificationResult.issueDate}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center" data-testid="qr-code">
                    <i className="fas fa-qrcode text-slate-800 text-3xl"></i>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
