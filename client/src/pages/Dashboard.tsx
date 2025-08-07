import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TransactionChart from "@/components/charts/TransactionChart";
import TranscriptVerifier from "@/components/dashboard/TranscriptVerifier";
import AnomalyHeatMap from "@/components/dashboard/AnomalyHeatMap";
import RecentIssuances from "@/components/dashboard/RecentIssuances";
import BlockchainStatus from "@/components/dashboard/BlockchainStatus";
import SmartContracts from "@/components/dashboard/SmartContracts";
import EthiopianUniversityMap from "@/components/dashboard/EthiopianUniversityMap";
import TransactionAnalytics from "@/components/dashboard/TransactionAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats, Activity, ChartData, RiskLevels, BlockchainStatus as BlockchainStatusType } from "@/types";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: transcripts = [], isLoading: transcriptsLoading } = useQuery({
    queryKey: ['/api/transcripts'],
  });

  // Mock data for components that would normally fetch from APIs
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'transcript_verified',
      message: 'Transcript verified for <span class="font-semibold">Addis Ababa University - Kebede Almaz #2845</span>',
      timestamp: '2 minutes ago',
      icon: 'custom-certificate',
      iconColor: 'text-primary'
    },
    {
      id: '2', 
      type: 'anomaly_detected',
      message: 'Anomaly detected in <span class="font-semibold">Bahir Dar Institute of Technology</span> transactions',
      timestamp: '15 minutes ago',
      icon: 'custom-alert',
      iconColor: 'text-destructive'
    },
    {
      id: '3',
      type: 'university_registered',
      message: 'New institution registered: <span class="font-semibold">Adama Science and Technology University</span>',
      timestamp: '1 hour ago',
      icon: 'custom-building',
      iconColor: 'text-emerald-400'
    },
    {
      id: '4',
      type: 'smart_contract_deployed',
      message: 'Smart contract deployed for <span class="font-semibold">Academic Verification Protocol v3.2</span>',
      timestamp: '2 hours ago',
      icon: 'custom-code',
      iconColor: 'text-cyan-400'
    },
    {
      id: '5',
      type: 'blockchain_sync',
      message: 'EduChain network synchronized: <span class="font-semibold">Block #3,924,567</span>',
      timestamp: '3 hours ago',
      icon: 'custom-chain',
      iconColor: 'text-green-400'
    }
  ];

  const mockChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Transaction Volume',
        data: [65000, 78000, 92000, 88000, 96000, 110000],
        borderColor: 'hsl(120, 100%, 50%)',
        backgroundColor: 'hsla(120, 100%, 50%, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Anomalies',
        data: [12, 19, 23, 15, 28, 23],
        borderColor: 'hsl(0, 84%, 60%)',
        backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const mockRiskLevels: RiskLevels = {
    low: 189,
    medium: 47,
    high: 23
  };

  const mockBlockchainStatus: BlockchainStatusType = {
    network: 'Polygon Testnet',
    gasPrice: '23 Gwei',
    blockNumber: 18245672,
    recentTransactions: [
      { hash: '0x1a2b3c4d...', timestamp: '2 min ago' },
      { hash: '0x5e6f7g8h...', timestamp: '5 min ago' }
    ]
  };

  if (statsLoading) {
    return (
      <DashboardLayout title="Dashboard Overview" subtitle="Monitor academic verification and financial transactions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-slate-800" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Overview" subtitle="Monitor academic verification and financial transactions">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Transcripts"
          value={stats?.totalTranscripts.toLocaleString() || '0'}
          icon="fas fa-certificate"
          iconColor="text-teal-400"
          change="+12% from last month"
          changeType="positive"
        />
        
        <StatsCard
          title="Active Universities"
          value={stats?.activeUniversities || 0}
          icon="fas fa-university"
          iconColor="text-orange-400"
          change="+5% from last month"
          changeType="positive"
        />
        
        <StatsCard
          title="Anomalies Detected"
          value={stats?.totalAnomalies || 0}
          icon="fas fa-exclamation-triangle"
          iconColor="text-red-400"
          change="+3 since yesterday"
          changeType="negative"
        />
        
        <StatsCard
          title="System Risk Score"
          value={`${stats?.systemRiskScore || 0}/10`}
          icon="fas fa-shield-alt"
          iconColor="text-yellow-400"
        >
          <div className="mt-4">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((stats?.systemRiskScore || 0) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </StatsCard>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Chart */}
          <TransactionChart 
            data={mockChartData} 
            title="Transaction Volume Analytics"
          />
          
          {/* Ethiopian University Network Map */}
          <EthiopianUniversityMap />
          
          {/* Transaction Analytics */}
          <TransactionAnalytics />
          
          {/* Transcript Verifier */}
          <TranscriptVerifier />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Issuances */}
          {transcriptsLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <RecentIssuances transcripts={transcripts} />
          )}
          
          {/* Activity Feed */}
          <ActivityFeed activities={mockActivities} />
          
          {/* Anomaly Heat Map */}
          <AnomalyHeatMap riskLevels={mockRiskLevels} />
          
          {/* Blockchain Status */}
          <BlockchainStatus status={mockBlockchainStatus} />
          
          {/* Smart Contracts */}
          <SmartContracts />
        </div>
      </div>
    </DashboardLayout>
  );
}
