import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Students() {
  // Ethiopian student data for demonstration
  const mockStudents = [
    {
      id: '1',
      name: 'Kebede Almaz',
      email: 'kebede.almaz@aau.edu.et',
      university: 'Addis Ababa University',
      transcriptCount: 2,
      verified: true,
      joinedDate: '2023-09-01',
    },
    {
      id: '2',
      name: 'Tigist Hailu',
      email: 'tigist.hailu@bits.edu.et',
      university: 'Bahir Dar Institute of Technology',
      transcriptCount: 1,
      verified: false,
      joinedDate: '2023-08-15',
    },
    {
      id: '3',
      name: 'Dawit Assefa',
      email: 'dawit.assefa@astu.edu.et',
      university: 'Adama Science and Technology University',
      transcriptCount: 3,
      verified: true,
      joinedDate: '2023-07-20',
    },
    {
      id: '4',
      name: 'Rahel Bekele',
      email: 'rahel.bekele@hu.edu.et',
      university: 'Hawassa University',
      transcriptCount: 2,
      verified: true,
      joinedDate: '2023-06-10',
    },
    {
      id: '5',
      name: 'Berhanu Tadesse',
      email: 'berhanu.tadesse@ju.edu.et',
      university: 'Jimma University',
      transcriptCount: 3,
      verified: false,
      joinedDate: '2023-05-22',
    }
  ];

  return (
    <DashboardLayout title="Student Management" subtitle="View and manage student profiles and transcripts">
      <div className="mb-6">
        <div className="text-slate-400">
          Total students: {mockStudents.length} | Verified: {mockStudents.filter(s => s.verified).length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <Card key={student.id} className="bg-slate-800 border-slate-700" data-testid={`card-student-${student.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white" data-testid={`text-name-${student.id}`}>
                  {student.name}
                </CardTitle>
                <Badge 
                  variant={student.verified ? "secondary" : "outline"}
                  className={student.verified ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}
                  data-testid={`badge-status-${student.id}`}
                >
                  {student.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white" data-testid={`text-email-${student.id}`}>{student.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-400">University</p>
                  <p className="text-white" data-testid={`text-university-${student.id}`}>{student.university}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-400">Transcripts</p>
                  <p className="text-white" data-testid={`text-transcript-count-${student.id}`}>
                    {student.transcriptCount} {student.transcriptCount === 1 ? 'transcript' : 'transcripts'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Joined</p>
                  <p className="text-white" data-testid={`text-joined-${student.id}`}>
                    {new Date(student.joinedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-slate-400 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">Student ID</p>
                      <p className="text-sm font-mono text-slate-300" data-testid={`text-id-${student.id}`}>
                        STU-{student.id.toUpperCase().padStart(6, '0')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockStudents.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-users text-slate-600 text-4xl mb-4"></i>
          <h3 className="text-xl font-medium text-slate-400 mb-2">No students found</h3>
          <p className="text-slate-500">Students will appear here once they register</p>
        </div>
      )}
    </DashboardLayout>
  );
}
