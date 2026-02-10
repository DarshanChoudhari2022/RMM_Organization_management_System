import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import History from "@/pages/History";
import Forts from "@/pages/Forts";
import Events from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import Tasks from "@/pages/Tasks";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Approve from "@/pages/Approve";
import Members from "@/pages/Members";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/history" element={<History />} />
          <Route path="/forts" element={<Forts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/approve/:token" element={<Approve />} />
          <Route path="/committee" element={<Members />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
