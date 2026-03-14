import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import History from "@/pages/History";
import Gallery from "@/pages/Gallery";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Approve from "@/pages/Approve";
import ConfirmSupplier from "@/pages/ConfirmSupplier";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const MainContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isLogin = location.pathname === "/login";
  const isApprove = location.pathname.startsWith("/approve");
  const isConfirmSupplier = location.pathname.startsWith("/confirm-supplier");
  const shouldHideNavbar = isDashboard || isLogin || isApprove || isConfirmSupplier;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
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
