import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "@/components/Navbar";

// Lazy Loaded Pages for performance (Code Splitting)
const Landing = lazy(() => import("@/pages/Landing"));
const History = lazy(() => import("@/pages/History"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const Approve = lazy(() => import("@/pages/Approve"));
const ConfirmSupplier = lazy(() => import("@/pages/ConfirmSupplier"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Robust React Query Configuration
import { toast } from "sonner"; // For elegant global error feedbacks

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Auto retry failing requests up to 2 times
      staleTime: 5 * 60 * 1000, 
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error("Mutation failed:", error);
        toast.error(`Action Failed: ${error.message || 'Please check your connection and try again.'}`);
      }
    }
  },
});

const GlobalFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        We've encountered an unexpected error. Don't worry, your data is safe.
      </p>
      <button 
        onClick={resetErrorBoundary} 
        className="px-6 py-3 bg-[#1D4ED8] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
      >
        Try Again
      </button>
      <div className="mt-8 p-4 bg-gray-50 rounded-xl max-w-lg w-full text-left overflow-auto border border-gray-100">
        <p className="text-xs text-red-500 font-mono font-medium">{error.message}</p>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8] rounded-full animate-spin"></div>
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading...</p>
    </div>
  </div>
);

const MainContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isLogin = location.pathname === "/login";
  const isApprove = location.pathname.startsWith("/approve");
  const isConfirmSupplier = location.pathname.startsWith("/confirm-supplier");
  const shouldHideNavbar = isDashboard || isLogin || isApprove || isConfirmSupplier;

  return (
    <ErrorBoundary FallbackComponent={GlobalFallback}>
      {!shouldHideNavbar && <Navbar />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/history" element={<History />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/approve/:token" element={<Approve />} />
          <Route path="/confirm-supplier/:id" element={<ConfirmSupplier />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
