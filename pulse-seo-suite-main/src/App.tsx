import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardConfigProvider } from "@/contexts/DashboardConfigContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Websites from "./pages/Websites";
import KeywordResearch from "./pages/KeywordResearch";
import RankTracker from "./pages/RankTracker";
import SiteAudit from "./pages/SiteAudit";
import ContentPlanner from "./pages/ContentPlanner";
import Backlinks from "./pages/Backlinks";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DashboardConfigProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/websites"
                element={
                  <ProtectedRoute>
                    <Websites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/keywords"
                element={
                  <ProtectedRoute>
                    <KeywordResearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rank-tracker"
                element={
                  <ProtectedRoute>
                    <RankTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/site-audit"
                element={
                  <ProtectedRoute>
                    <SiteAudit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content-planner"
                element={
                  <ProtectedRoute>
                    <ContentPlanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backlinks"
                element={
                  <ProtectedRoute>
                    <Backlinks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
