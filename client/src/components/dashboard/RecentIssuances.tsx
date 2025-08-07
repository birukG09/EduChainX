import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CertificateIcon, TrendingUpIcon, ClockIcon } from "@/components/CustomIcons";
import type { Transcript } from "@shared/schema";

interface RecentIssuancesProps {
  transcripts: Transcript[];
}

export default function RecentIssuances({ transcripts }: RecentIssuancesProps) {
  // Calculate analytics
  const verifiedCount = transcripts.filter(t => t.verified).length;
  const verificationRate = transcripts.length > 0 ? (verifiedCount / transcripts.length) * 100 : 0;
  
  // Ethiopian university logos mapping
  const universityLogos: { [key: string]: string } = {
    'Addis Ababa University': '🏛️',
    'Bahir Dar Institute of Technology': '🔬',
    'Adama Science and Technology University': '⚙️',
    'Hawassa University': '📚',
    'Jimma University': '🎓'
  };

  const getUniversityFromStudent = (studentName: string) => {
    if (studentName?.includes('Kebede')) return 'Addis Ababa University';
    if (studentName?.includes('Tigist')) return 'Bahir Dar Institute of Technology';
    if (studentName?.includes('Dawit')) return 'Adama Science and Technology University';
    if (studentName?.includes('Rahel')) return 'Hawassa University';
    if (studentName?.includes('Berhanu')) return 'Jimma University';
    return 'Unknown University';
  };

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CertificateIcon className="w-5 h-5 text-primary" />
          Recent Issuances Analytics
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUpIcon className="w-4 h-4" />
            Verification Rate: {verificationRate.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {transcripts.length} Total Transcripts
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Verification Progress */}
        <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Verification Progress</span>
            <span className="text-sm text-primary font-bold">{verifiedCount}/{transcripts.length}</span>
          </div>
          <Progress value={verificationRate} className="h-2" />
        </div>

        {/* Recent Transcripts */}
        <div className="space-y-3">
          {transcripts.slice(0, 4).map((transcript) => {
            const university = getUniversityFromStudent(transcript.studentName);
            const universityEmoji = universityLogos[university] || '🎓';
            
            return (
              <div 
                key={transcript.id} 
                className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg border border-accent/10 hover:bg-accent/10 transition-colors"
                data-testid={`transcript-${transcript.id}`}
              >
                {/* University Icon */}
                <div className="w-10 h-10 flex items-center justify-center bg-primary/20 rounded-lg text-xl">
                  {universityEmoji}
                </div>
                
                {/* Transcript Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground truncate text-sm" data-testid={`text-degree-${transcript.id}`}>
                      {transcript.degree}
                    </h4>
                    <Badge 
                      variant={transcript.verified ? "default" : "secondary"}
                      className={transcript.verified ? "bg-primary/20 text-primary border-primary/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}
                      data-testid={`badge-status-${transcript.id}`}
                    >
                      {transcript.verified ? "✓ Verified" : "⏳ Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid={`text-university-${transcript.id}`}>
                    {transcript.studentName} • {university}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transcript.issueDate).toLocaleDateString('en-ET', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Risk Score Indicator */}
                <div className="text-right">
                  <div className={`w-2 h-2 rounded-full ${transcript.verified ? 'bg-primary' : 'bg-yellow-500'}`} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {transcript.verified ? '100%' : '85%'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {transcripts.length === 0 && (
            <div className="text-center py-8">
              <CertificateIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No recent transcript issuances</p>
              <p className="text-sm text-muted-foreground/70">Verified transcripts will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        {transcripts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-accent/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{transcripts.filter(t => t.verified).length}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-500">{transcripts.filter(t => !t.verified).length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-lg font-bold text-cyan-400">{new Set(transcripts.map(t => getUniversityFromStudent(t.studentName))).size}</p>
                <p className="text-xs text-muted-foreground">Universities</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
