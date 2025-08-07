import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import TransactionChart from "@/components/charts/TransactionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@shared/schema";
import type { ChartData } from "@/types";

export default function FinancialMonitor() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  // Ethiopian universities financial monitoring data
  const chartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tuition Revenue (ETB)',
        data: [12500000, 11800000, 13200000, 11950000, 14100000, 15300000],
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Research Grants (USD)',
        data: [85000, 92000, 78000, 105000, 89000, 96000],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const transactionTypes = {
    tuition: { count: 0, total: 0, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    grants: { count: 0, total: 0, color: 'text-green-400', bg: 'bg-green-900/30' },
    fees: { count: 0, total: 0, color: 'text-orange-400', bg: 'bg-orange-900/30' },
    services: { count: 0, total: 0, color: 'text-purple-400', bg: 'bg-purple-900/30' },
  };

  // Calculate transaction statistics
  transactions.forEach(tx => {
    const type = tx.type as keyof typeof transactionTypes;
    if (transactionTypes[type]) {
      transactionTypes[type].count++;
      transactionTypes[type].total += parseFloat(tx.amount);
    }
  });

  return (
    <DashboardLayout title="Financial Monitor" subtitle="Track financial transactions and detect anomalies">
      
      {/* Transaction Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(transactionTypes).map(([type, stats]) => (
          <Card key={type} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium capitalize">
                    {type}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${stats.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400">
                    {stats.count} transactions
                  </p>
                </div>
                <div className={`w-12 h-12 ${stats.bg} rounded-lg flex items-center justify-center`}>
                  <i className={`fas fa-dollar-sign ${stats.color} text-xl`}></i>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Chart */}
      <div className="mb-8">
        <TransactionChart data={chartData} />
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-chart-line text-slate-600 text-3xl mb-2"></i>
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 10).map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${transactionTypes[transaction.type as keyof typeof transactionTypes]?.bg || 'bg-slate-700'} rounded-full flex items-center justify-center`}>
                      <i className={`fas fa-dollar-sign ${transactionTypes[transaction.type as keyof typeof transactionTypes]?.color || 'text-slate-400'} text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white capitalize" data-testid={`text-type-${transaction.id}`}>
                        {transaction.type}
                      </h4>
                      <p className="text-sm text-slate-400" data-testid={`text-description-${transaction.id}`}>
                        {transaction.description || 'No description'}
                      </p>
                      <p className="text-xs text-slate-500" data-testid={`text-timestamp-${transaction.id}`}>
                        {new Date(transaction.timestamp!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white" data-testid={`text-amount-${transaction.id}`}>
                      ${parseFloat(transaction.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-900/30 text-green-400 border-green-700' 
                            : 'bg-yellow-900/30 text-yellow-400 border-yellow-700'
                        }`}
                        data-testid={`badge-status-${transaction.id}`}
                      >
                        {transaction.status}
                      </Badge>
                      {parseFloat(transaction.riskScore || '0') > 5 && (
                        <Badge variant="destructive" className="text-xs" data-testid={`badge-risk-${transaction.id}`}>
                          Risk: {transaction.riskScore}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
