import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Anomaly } from "@shared/schema";
import { useState } from "react";

export default function Anomalies() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: anomalies = [], isLoading } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies'],
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/anomalies/${id}/resolve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/anomalies'] });
      toast({
        title: "Success",
        description: "Anomaly resolved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resolve anomaly",
        variant: "destructive",
      });
    },
  });

  // Filter anomalies based on selected filters
  const filteredAnomalies = anomalies.filter(anomaly => {
    const severityMatch = severityFilter === "all" || anomaly.severity === severityFilter;
    const statusMatch = statusFilter === "all" || 
      (statusFilter === "resolved" && anomaly.resolved) ||
      (statusFilter === "unresolved" && !anomaly.resolved);
    return severityMatch && statusMatch;
  });

  // Calculate statistics
  const stats = {
    total: anomalies.length,
    high: anomalies.filter(a => a.severity === 'high' && !a.resolved).length,
    medium: anomalies.filter(a => a.severity === 'medium' && !a.resolved).length,
    low: anomalies.filter(a => a.severity === 'low' && !a.resolved).length,
    resolved: anomalies.filter(a => a.resolved).length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/30 border-red-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'low': return 'text-green-400 bg-green-900/30 border-green-700';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return 'fas fa-exclamation-triangle';
      case 'medium': return 'fas fa-exclamation-circle';
      case 'low': return 'fas fa-info-circle';
      default: return 'fas fa-question-circle';
    }
  };

  return (
    <DashboardLayout title="Anomaly Detection" subtitle="Monitor and resolve financial anomalies and security threats">
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white" data-testid="stat-total">
              {stats.total}
            </div>
            <div className="text-sm text-slate-400">Total Anomalies</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400" data-testid="stat-high">
              {stats.high}
            </div>
            <div className="text-sm text-slate-400">High Risk</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400" data-testid="stat-medium">
              {stats.medium}
            </div>
            <div className="text-sm text-slate-400">Medium Risk</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400" data-testid="stat-low">
              {stats.low}
            </div>
            <div className="text-sm text-slate-400">Low Risk</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400" data-testid="stat-resolved">
              {stats.resolved}
            </div>
            <div className="text-sm text-slate-400">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white" data-testid="select-severity">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white" data-testid="select-status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="unresolved">Unresolved</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1"></div>
        
        <div className="text-sm text-slate-400 self-center">
          Showing {filteredAnomalies.length} of {anomalies.length} anomalies
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-600 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredAnomalies.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <i className="fas fa-shield-alt text-slate-600 text-4xl mb-4"></i>
              <h3 className="text-xl font-medium text-slate-400 mb-2">
                {anomalies.length === 0 ? "No anomalies detected" : "No anomalies match your filters"}
              </h3>
              <p className="text-slate-500">
                {anomalies.length === 0 
                  ? "Your system is operating normally" 
                  : "Try adjusting your filter criteria"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnomalies.map((anomaly) => (
            <Card key={anomaly.id} className="bg-slate-800 border-slate-700" data-testid={`card-anomaly-${anomaly.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      anomaly.severity === 'high' ? 'bg-red-900/30' :
                      anomaly.severity === 'medium' ? 'bg-yellow-900/30' :
                      'bg-green-900/30'
                    }`}>
                      <i className={`${getSeverityIcon(anomaly.severity)} ${
                        anomaly.severity === 'high' ? 'text-red-400' :
                        anomaly.severity === 'medium' ? 'text-yellow-400' :
                        'text-green-400'
                      } text-lg`}></i>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white" data-testid={`text-description-${anomaly.id}`}>
                          {anomaly.description}
                        </h3>
                        <Badge 
                          className={getSeverityColor(anomaly.severity)}
                          data-testid={`badge-severity-${anomaly.id}`}
                        >
                          {anomaly.severity.toUpperCase()}
                        </Badge>
                        {anomaly.resolved && (
                          <Badge className="bg-blue-900/30 text-blue-400 border-blue-700" data-testid={`badge-resolved-${anomaly.id}`}>
                            RESOLVED
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Risk Score:</span>
                          <span className="ml-2 font-semibold text-white" data-testid={`text-risk-score-${anomaly.id}`}>
                            {parseFloat(anomaly.riskScore).toFixed(1)}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Transaction ID:</span>
                          <span className="ml-2 font-mono text-slate-300 text-xs" data-testid={`text-transaction-id-${anomaly.id}`}>
                            {anomaly.transactionId.slice(0, 8)}...
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Detected:</span>
                          <span className="ml-2 text-white" data-testid={`text-timestamp-${anomaly.id}`}>
                            {new Date(anomaly.timestamp!).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!anomaly.resolved && (
                      <Button
                        onClick={() => resolveMutation.mutate(anomaly.id)}
                        disabled={resolveMutation.isPending}
                        className="bg-teal-500 hover:bg-teal-600"
                        data-testid={`button-resolve-${anomaly.id}`}
                      >
                        {resolveMutation.isPending ? "Resolving..." : "Resolve"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid={`button-details-${anomaly.id}`}
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
