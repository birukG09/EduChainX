import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskLevels } from "@/types";

interface AnomalyHeatMapProps {
  riskLevels: RiskLevels;
}

const riskAreas = [
  {
    name: "Addis Ababa Universities",
    risk: "low",
    color: "bg-green-400",
    textColor: "text-green-400"
  },
  {
    name: "Amhara Region Universities", 
    risk: "medium",
    color: "bg-yellow-400",
    textColor: "text-yellow-400"
  },
  {
    name: "Oromia Region Universities",
    risk: "high", 
    color: "bg-red-400",
    textColor: "text-red-400"
  },
  {
    name: "SNNP Region Universities",
    risk: "low",
    color: "bg-green-400", 
    textColor: "text-green-400"
  }
];

export default function AnomalyHeatMap({ riskLevels }: AnomalyHeatMapProps) {
  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Regional Risk Analysis - Ethiopia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Level Indicators */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center" data-testid="risk-level-low">
            <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-slate-400">Low Risk</span>
            <div className="text-lg font-bold text-white">{riskLevels.low}</div>
          </div>
          <div className="text-center" data-testid="risk-level-medium">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-slate-400">Medium Risk</span>
            <div className="text-lg font-bold text-white">{riskLevels.medium}</div>
          </div>
          <div className="text-center" data-testid="risk-level-high">
            <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-slate-400">High Risk</span>
            <div className="text-lg font-bold text-white">{riskLevels.high}</div>
          </div>
        </div>

        {/* University Campus Image */}
        <img 
          src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
          alt="University campus overview" 
          className="w-full h-32 object-cover rounded-lg mb-4"
          data-testid="img-university-campus"
        />

        {/* Geographic Risk Distribution */}
        <div className="space-y-3">
          {riskAreas.map((area, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
              data-testid={`risk-area-${area.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${area.color} rounded-full ${area.risk === 'high' ? 'animate-pulse' : ''}`}></div>
                <span className="text-white">{area.name}</span>
              </div>
              <span className={`${area.textColor} font-semibold capitalize`}>{area.risk} Risk</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
