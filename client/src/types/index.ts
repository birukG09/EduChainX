export interface DashboardStats {
  totalTranscripts: number;
  activeUniversities: number;
  totalAnomalies: number;
  systemRiskScore: number;
}

export interface Activity {
  id: string;
  type: 'transcript_verified' | 'anomaly_detected' | 'university_registered' | 'smart_contract_deployed' | 'blockchain_sync';
  message: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
    tension?: number;
    yAxisID?: string;
  }[];
}

export interface TranscriptVerificationResult {
  verified: boolean;
  student: string;
  university: string;
  degree: string;
  issueDate: string;
  transactionHash: string;
}

export interface RiskLevels {
  low: number;
  medium: number;
  high: number;
}

export interface BlockchainStatus {
  network: string;
  gasPrice: string;
  blockNumber: number;
  recentTransactions: {
    hash: string;
    timestamp: string;
  }[];
}
