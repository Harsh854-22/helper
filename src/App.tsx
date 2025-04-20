
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Resources from "./pages/Resources";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import AI from "./pages/AI";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import DisasterKitStores from "./pages/DisasterKitStores";
import Blogspot from "./pages/Blogspot";
import VolunteerSignup from "./pages/VolunteerSignup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contacts" 
                element={
                  <ProtectedRoute>
                    <Contacts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai" 
                element={
                  <ProtectedRoute>
                    <AI />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/weather" 
                element={
                  <ProtectedRoute>
                    <Weather />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/disaster-kit-stores" 
                element={
                  <ProtectedRoute>
                    <DisasterKitStores />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/VolunteerSignup" 
                element={
                  <ProtectedRoute>
                    <VolunteerSignup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/blogspot" 
                element={
                  <ProtectedRoute>
                    <Blogspot />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
