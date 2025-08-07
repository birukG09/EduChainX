import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogoWithText } from "@/components/Logo";
import { 
  DashboardIcon, 
  CertificateIcon, 
  UniversityIcon, 
  UsersIcon, 
  ChartIcon, 
  AlertIcon, 
  BlockchainIcon, 
  SettingsIcon 
} from "@/components/CustomIcons";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const navigationItems = [
  { href: "/", icon: DashboardIcon, label: "Dashboard", color: "text-primary" },
  { href: "/transcripts", icon: CertificateIcon, label: "Transcripts", color: "text-emerald-400" },
  { href: "/universities", icon: UniversityIcon, label: "Universities", color: "text-green-400" },
  { href: "/students", icon: UsersIcon, label: "Students", color: "text-lime-400" },
  { href: "/financial-monitor", icon: ChartIcon, label: "Financial Monitor", color: "text-teal-400" },
  { href: "/anomalies", icon: AlertIcon, label: "Anomalies", color: "text-red-400" },
  { href: "/blockchain", icon: BlockchainIcon, label: "Blockchain", color: "text-cyan-400" },
  { href: "/settings", icon: SettingsIcon, label: "Settings", color: "text-muted-foreground" },
];

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col crypto-glow">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <LogoWithText size="sm" className="animate-glow" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`crypto-nav-item ${
                  location === item.href ? "active" : ""
                }`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className={location === item.href ? "font-medium" : ""}>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-primary/30">
              <AvatarImage src={(user as any)?.profileImageUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary">
                {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {(user as any)?.firstName} {(user as any)?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">{(user as any)?.role || 'Student'}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="text-current">
                <path fill="currentColor" d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H4v16h10v-2h2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z"/>
              </svg>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 crypto-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground crypto-gradient bg-clip-text text-transparent">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <Badge 
                variant="outline" 
                className="border-primary bg-primary/10 text-primary animate-pulse-green"
                data-testid="badge-network-status"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
                EduChain Network
              </Badge>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-muted-foreground hover:text-primary hover:bg-primary/10"
                data-testid="button-notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-current">
                  <path fill="currentColor" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path fill="currentColor" d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full neon-glow"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
