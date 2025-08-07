import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Transcripts from "@/pages/Transcripts";
import Universities from "@/pages/Universities";
import Students from "@/pages/Students";
import FinancialMonitor from "@/pages/FinancialMonitor";
import Anomalies from "@/pages/Anomalies";
import Blockchain from "@/pages/Blockchain";
import Settings from "@/pages/Settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/transcripts" component={Transcripts} />
          <Route path="/universities" component={Universities} />
          <Route path="/students" component={Students} />
          <Route path="/financial-monitor" component={FinancialMonitor} />
          <Route path="/anomalies" component={Anomalies} />
          <Route path="/blockchain" component={Blockchain} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
