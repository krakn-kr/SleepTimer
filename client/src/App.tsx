import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Trends from "@/pages/Trends";
import NotFound from "@/pages/not-found";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp } from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          <Link href="/">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              data-testid="nav-dashboard"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/trends">
            <Button
              variant={location === "/trends" ? "default" : "ghost"}
              data-testid="nav-trends"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </Button>
          </Link>
        </div>
        
        {children}
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/trends" component={Trends} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
