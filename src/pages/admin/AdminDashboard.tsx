import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Package, ShoppingCart, BarChart3, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { InventoryTab } from "@/components/admin/InventoryTab";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage products, view orders, and track inventory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Inventory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
