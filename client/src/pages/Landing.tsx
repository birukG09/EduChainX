import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogoWithText } from "@/components/Logo";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald/10"></div>
        
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <LogoWithText size="lg" className="animate-glow" />
            </div>

            {/* Main Content */}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Decentralized Academic
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                  {" "}Verification
                </span>
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Secure blockchain-powered transcript verification with real-time financial 
                forensics and anomaly detection for universities and students worldwide.
              </p>

              {/* Features Grid */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Card className="crypto-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 neon-glow">
                      <i className="fas fa-shield-alt text-primary text-xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Blockchain Security</h3>
                    <p className="text-muted-foreground">Immutable transcript records on EduChain blockchain</p>
                  </CardContent>
                </Card>

                <Card className="crypto-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 crypto-glow">
                      <i className="fas fa-chart-line text-green-400 text-xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Financial Forensics</h3>
                    <p className="text-muted-foreground">Real-time anomaly detection and risk scoring</p>
                  </CardContent>
                </Card>

                <Card className="crypto-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse-green">
                      <i className="fas fa-university text-teal-400 text-xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Role Access</h3>
                    <p className="text-muted-foreground">Tailored dashboards for admins, auditors, and students</p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Button */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  onClick={handleLogin}
                  className="crypto-button text-lg animate-glow"
                  data-testid="button-login"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Enter EduChainX
                </Button>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 py-3 px-8 text-lg"
                  data-testid="button-learn-more"
                >
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-20">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Trusted by Leading Ethiopian Universities
                </p>
                <div className="mt-6 flex items-center justify-center space-x-8 opacity-60">
                  <div className="text-muted-foreground font-semibold">AAU</div>
                  <div className="text-muted-foreground font-semibold">BITS College</div>
                  <div className="text-muted-foreground font-semibold">ASTU</div>
                  <div className="text-muted-foreground font-semibold">Hawassa University</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
