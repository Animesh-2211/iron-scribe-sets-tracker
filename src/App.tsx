
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WorkoutProvider } from "@/contexts/SupabaseWorkoutContext";
import { ClerkLoaded, SignedIn, SignedOut, ClerkProvider, useAuth } from '@clerk/clerk-react';
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Workouts from "@/pages/Workouts";
import WorkoutDetail from "@/pages/WorkoutDetail";
import Progress from "@/pages/Progress";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Clerk protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkLoaded>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/auth" replace />
      </SignedOut>
    </ClerkLoaded>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WorkoutProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={
              <ClerkLoaded>
                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
                <SignedOut>
                  <Auth />
                </SignedOut>
              </ClerkLoaded>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/workouts" element={
              <ProtectedRoute>
                <AppLayout>
                  <Workouts />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/workouts/:workoutId" element={
              <ProtectedRoute>
                <AppLayout>
                  <WorkoutDetail />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <AppLayout>
                  <Progress />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <AppLayout>
                  <Calendar />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WorkoutProvider>
  </QueryClientProvider>
);

export default App;
