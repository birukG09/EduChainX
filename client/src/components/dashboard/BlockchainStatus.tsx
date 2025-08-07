import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlockchainStatus as BlockchainStatusType } from "@/types";

interface BlockchainStatusProps {
  status: BlockchainStatusType;
}

export default function BlockchainStatus({ status }: BlockchainStatusProps) {
  return (
    <Card className="glass-morphism border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Blockchain Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Network Info */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <span className="text-slate-400">Network</span>
            <span className="text-white font-medium" data-testid="text-network">{status.network}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <span className="text-slate-400">Gas Price</span>
            <span className="text-white font-medium" data-testid="text-gas-price">{status.gasPrice}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <span className="text-slate-400">Block Number</span>
            <span className="text-white font-medium" data-testid="text-block-number">
              {status.blockNumber.toLocaleString()}
            </span>
          </div>
          
          {/* Recent Transactions */}
          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-sm font-medium text-white mb-3">Recent Transactions</h4>
            <div className="space-y-2">
              {status.recentTransactions.map((tx, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded"
                  data-testid={`transaction-${index}`}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs font-mono text-slate-300 truncate" data-testid={`text-hash-${index}`}>
                    {tx.hash}
                  </span>
                  <span className="text-xs text-slate-400" data-testid={`text-timestamp-${index}`}>
                    {tx.timestamp}
                  </span>
                </div>
              ))}
              {status.recentTransactions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
