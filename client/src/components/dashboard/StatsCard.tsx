import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  children?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconColor,
  change,
  changeType = 'positive',
  children
}: StatsCardProps) {
  return (
    <Card className="crypto-stat-card group hover:crypto-glow transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors" data-testid={`value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 neon-glow`}>
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-primary group-hover:animate-pulse">
            <path fill="currentColor" d="M12 2L2 8l10 5 10-5-10-5z"/>
            <rect fill="currentColor" x="7" y="12" width="2" height="6"/>
            <rect fill="currentColor" x="11" y="12" width="2" height="6"/>
            <rect fill="currentColor" x="15" y="12" width="2" height="6"/>
          </svg>
        </div>
      </div>
      {change && (
        <div className={`mt-4 flex items-center text-sm ${changeType === 'positive' ? 'profit-green' : 'loss-red'}`}>
          <i className={`fas ${changeType === 'positive' ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
          <span className="font-medium">{change}</span>
        </div>
      )}
      {children}
    </Card>
  );
}
