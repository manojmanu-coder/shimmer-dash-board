import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import MasterData from "./pages/MasterData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />
          <Route path="/products" element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          } />
          <Route path="/orders" element={
            <AdminLayout>
              <Orders />
            </AdminLayout>
          } />
          <Route path="/users" element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          } />
          <Route path="/master/categories" element={
            <AdminLayout>
              <MasterData />
            </AdminLayout>
          } />
          <Route path="/master/seller" element={
            <AdminLayout>
              <MasterData />
            </AdminLayout>
          } />
          <Route path="/master/warehouse" element={
            <AdminLayout>
              <MasterData />
            </AdminLayout>
          } />
          <Route path="/master/inventory" element={
            <AdminLayout>
              <MasterData />
            </AdminLayout>
          } />
          <Route path="/master/stock" element={
            <AdminLayout>
              <MasterData />
            </AdminLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
