import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnalyticsIcon, TrendingUpIcon, AlertTriangleIcon } from "@/components/CustomIcons";

interface TransactionAnalyticsProps {
  transactions?: any[];
}

export default function TransactionAnalytics({ transactions = [] }: TransactionAnalyticsProps) {
  // Ethiopian Birr and USD transaction analytics
  const mockTransactionData = {
    totalVolume: {
      etb: 45750000, // Ethiopian Birr
      usd: 875000
    },
    monthlyGrowth: {
      etb: 12.5,
      usd: 8.3
    },
    transactionTypes: [
      { type: 'Tuition Payments', amount: 28500000, currency: 'ETB', count: 1240, trend: 'up', color: 'text-blue-400' },
      { type: 'Research Grants', amount: 450000, currency: 'USD', count: 45, trend: 'up', color: 'text-green-400' },
      { type: 'Scholarship Funds', amount: 8750000, currency: 'ETB', count: 320, trend: 'stable', color: 'text-purple-400' },
      { type: 'International Transfer', amount: 275000, currency: 'USD', count: 18, trend: 'down', color: 'text-orange-400' },
      { type: 'Facility Maintenance', amount: 5200000, currency: 'ETB', count: 85, trend: 'up', color: 'text-cyan-400' },
      { type: 'Equipment Purchase', amount: 150000, currency: 'USD', count: 12, trend: 'stable', color: 'text-indigo-400' }
    ],
    anomalyStats: {
      detected: 7,
      resolved: 4,
      critical: 2,
      riskScore: 15.3
    },
    universityBreakdown: [
      { name: 'Addis Ababa University', volume: 18250000, currency: 'ETB', risk: 'low', transactions: 485 },
      { name: 'Bahir Dar Institute of Technology', volume: 12800000, currency: 'ETB', risk: 'medium', transactions: 325 },
      { name: 'Adama Science and Technology University', volume: 8950000, currency: 'ETB', risk: 'low', transactions: 280 },
      { name: 'Hawassa University', volume: 4200000, currency: 'ETB', risk: 'low', transactions: 165 },
      { name: 'Jimma University', volume: 1550000, currency: 'ETB', risk: 'high', transactions: 95 }
    ]
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'ETB') {
      return new Intl.NumberFormat('en-ET', { 
        style: 'currency', 
        currency: 'ETB',
        minimumFractionDigits: 0 
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-primary bg-primary/20 border-primary/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/30';
      default: return 'text-muted-foreground bg-accent/20 border-accent/30';
    }
  };

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AnalyticsIcon className="w-5 h-5 text-primary" />
          Financial Transaction Analytics
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUpIcon className="w-4 h-4" />
            Monthly Growth: ETB +{mockTransactionData.monthlyGrowth.etb}% • USD +{mockTransactionData.monthlyGrowth.usd}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Total Volume Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume (ETB)</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(mockTransactionData.totalVolume.etb, 'ETB')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-green-400">+{mockTransactionData.monthlyGrowth.etb}%</span>
                  <span className="text-xs text-muted-foreground">this month</span>
                </div>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          
          <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume (USD)</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(mockTransactionData.totalVolume.usd, 'USD')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-green-400">+{mockTransactionData.monthlyGrowth.usd}%</span>
                  <span className="text-xs text-muted-foreground">this month</span>
                </div>
              </div>
              <div className="text-3xl">💵</div>
            </div>
          </div>
        </div>

        {/* Transaction Types Breakdown */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            📊 Transaction Categories
          </h4>
          <div className="space-y-3">
            {mockTransactionData.transactionTypes.map((type, index) => (
              <div key={index} className="p-3 bg-accent/5 rounded-lg border border-accent/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTrendIcon(type.trend)}</span>
                    <span className="font-medium text-foreground text-sm">{type.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {type.count} transactions
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${type.color}`}>
                      {formatCurrency(type.amount, type.currency)}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(type.amount / (type.currency === 'ETB' ? mockTransactionData.totalVolume.etb : mockTransactionData.totalVolume.usd)) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Detection Summary */}
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangleIcon className="w-5 h-5 text-red-500" />
            <h4 className="font-medium text-foreground">Anomaly Detection</h4>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-red-500">{mockTransactionData.anomalyStats.detected}</p>
              <p className="text-xs text-muted-foreground">Detected</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-400">{mockTransactionData.anomalyStats.resolved}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
            <div>
              <p className="text-xl font-bold text-orange-500">{mockTransactionData.anomalyStats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-500">{mockTransactionData.anomalyStats.riskScore}%</p>
              <p className="text-xs text-muted-foreground">Risk Score</p>
            </div>
          </div>
        </div>

        {/* University Performance */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            🏛️ University Transaction Volume
          </h4>
          <div className="space-y-2">
            {mockTransactionData.universityBreakdown.map((university, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/20 rounded-lg text-sm">
                    {['🏛️', '🔬', '⚙️', '📚', '🎓'][index]}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{university.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getRiskColor(university.risk)}`}>
                        {university.risk.toUpperCase()} Risk
                      </Badge>
                      <span className="text-xs text-muted-foreground">{university.transactions} transactions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">
                    {formatCurrency(university.volume, university.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((university.volume / mockTransactionData.totalVolume.etb) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}