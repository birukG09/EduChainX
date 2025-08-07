import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapIcon, TrendingUpIcon } from "@/components/CustomIcons";

interface UniversityData {
  id: string;
  name: string;
  region: string;
  students: number;
  transcripts: number;
  verificationRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  logo: string;
}

export default function EthiopianUniversityMap() {
  const universities: UniversityData[] = [
    {
      id: 'aau',
      name: 'Addis Ababa University',
      region: 'Addis Ababa',
      students: 45000,
      transcripts: 2340,
      verificationRate: 94.5,
      riskLevel: 'low',
      logo: '🏛️'
    },
    {
      id: 'bits',
      name: 'Bahir Dar Institute of Technology',
      region: 'Amhara',
      students: 18500,
      transcripts: 1230,
      verificationRate: 87.2,
      riskLevel: 'medium',
      logo: '🔬'
    },
    {
      id: 'astu',
      name: 'Adama Science and Technology University',
      region: 'Oromia',
      students: 22000,
      transcripts: 1850,
      verificationRate: 91.8,
      riskLevel: 'low',
      logo: '⚙️'
    },
    {
      id: 'hu',
      name: 'Hawassa University',
      region: 'SNNP',
      students: 35000,
      transcripts: 2100,
      verificationRate: 89.3,
      riskLevel: 'low',
      logo: '📚'
    },
    {
      id: 'ju',
      name: 'Jimma University',
      region: 'Oromia',
      students: 28000,
      transcripts: 1680,
      verificationRate: 82.1,
      riskLevel: 'high',
      logo: '🎓'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-primary bg-primary/20 border-primary/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/30';
      default: return 'text-muted-foreground bg-accent/20 border-accent/30';
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Addis Ababa': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Amhara': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Oromia': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'SNNP': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const totalStudents = universities.reduce((sum, uni) => sum + uni.students, 0);
  const totalTranscripts = universities.reduce((sum, uni) => sum + uni.transcripts, 0);
  const avgVerificationRate = universities.reduce((sum, uni) => sum + uni.verificationRate, 0) / universities.length;

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-primary" />
          Ethiopian University Network
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUpIcon className="w-4 h-4" />
            Avg Verification: {avgVerificationRate.toFixed(1)}%
          </div>
          <div>
            {universities.length} Universities • {totalStudents.toLocaleString()} Students
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Network Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{universities.length}</p>
            <p className="text-xs text-muted-foreground">Active Universities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{totalTranscripts.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Transcripts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{avgVerificationRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Network Health</p>
          </div>
        </div>

        {/* University List */}
        <div className="space-y-3">
          {universities.map((university) => (
            <div 
              key={university.id}
              className="p-4 bg-accent/5 rounded-lg border border-accent/10 hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/20 rounded-lg text-2xl">
                    {university.logo}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{university.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRegionColor(university.region)}`}
                      >
                        {university.region} Region
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRiskColor(university.riskLevel)}`}
                      >
                        {university.riskLevel.toUpperCase()} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{university.verificationRate}%</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Verification Progress</span>
                  <span className="text-xs font-medium text-foreground">
                    {Math.floor(university.transcripts * university.verificationRate / 100)}/{university.transcripts}
                  </span>
                </div>
                <Progress value={university.verificationRate} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <p className="font-semibold text-foreground">{university.students.toLocaleString()}</p>
                  <p className="text-muted-foreground">Students</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{university.transcripts.toLocaleString()}</p>
                  <p className="text-muted-foreground">Transcripts</p>
                </div>
                <div>
                  <p className="font-semibold text-primary">{Math.floor(university.transcripts * university.verificationRate / 100)}</p>
                  <p className="text-muted-foreground">Verified</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regional Summary */}
        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <h5 className="font-medium text-foreground mb-3">Regional Distribution</h5>
          <div className="grid grid-cols-2 gap-3">
            {['Addis Ababa', 'Amhara', 'Oromia', 'SNNP'].map((region) => {
              const regionUniversities = universities.filter(u => u.region === region);
              const regionStudents = regionUniversities.reduce((sum, u) => sum + u.students, 0);
              
              return (
                <div key={region} className="flex justify-between items-center">
                  <Badge variant="outline" className={`text-xs ${getRegionColor(region)}`}>
                    {region}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{regionUniversities.length}</p>
                    <p className="text-xs text-muted-foreground">{regionStudents.toLocaleString()} students</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}