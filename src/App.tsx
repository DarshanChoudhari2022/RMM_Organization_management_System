import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import History from "@/pages/History";
import Forts from "@/pages/Forts";
import Gallery from "@/pages/Gallery";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Approve from "@/pages/Approve";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const MainContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isLogin = location.pathname === "/login";
  const isApprove = location.pathname.startsWith("/approve");
  const shouldHideNavbar = isDashboard || isLogin || isApprove || location.pathname === "/history";

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/history" element={<History />} />
        <Route path="/forts" element={<Forts />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/approve/:token" element={<Approve />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
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
