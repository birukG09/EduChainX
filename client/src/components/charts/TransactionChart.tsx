import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ChartData } from "@/types";

interface TransactionChartProps {
  data: ChartData;
}

export default function TransactionChart({ data }: TransactionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#e2e8f0'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: { color: '#94a3b8' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <Card className="glass-morphism border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            Transaction Volume Analysis
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" className="bg-teal-500 hover:bg-teal-600 text-white" data-testid="button-7d">
              7D
            </Button>
            <Button size="sm" variant="outline" className="bg-slate-700 text-slate-300" data-testid="button-30d">
              30D
            </Button>
            <Button size="sm" variant="outline" className="bg-slate-700 text-slate-300" data-testid="button-90d">
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container relative h-[300px] w-full">
          <canvas ref={canvasRef} data-testid="chart-transactions"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
