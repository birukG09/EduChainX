import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types";
import { CustomIcon, ClockIcon } from "@/components/CustomIcons";

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <ClockIcon className="text-primary mr-2" size={18} />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
              data-testid={`activity-${activity.id}`}
            >
              <div className={`w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-green`}>
                <CustomIcon name={activity.icon as any} className={activity.iconColor} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <svg width="48" height="48" viewBox="0 0 24 24" className="text-muted-foreground mx-auto mb-2">
                <path fill="currentColor" d="M21 8V7l-3 2-3-2v1l3 2 3-2zM1 12h18v7H1v-7zM1 8h14v2H1V8zM1 4h14v2H1V4z"/>
              </svg>
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
