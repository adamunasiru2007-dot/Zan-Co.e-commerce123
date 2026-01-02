import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ShoppingBag, Star, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  user_name?: string;
}

interface Review {
  id: string;
  product_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_name?: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG").format(price);
};

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load users
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      setUsers(profilesData || []);

      // Load orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      // Get user names for orders
      const ordersWithNames = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", order.user_id)
            .maybeSingle();
          return { ...order, user_name: profile?.name || "Unknown" };
        })
      );
      setOrders(ordersWithNames);

      // Load reviews
      const { data: reviewsData } = await supabase
        .from("product_reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      const reviewsWithNames = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", review.user_id)
            .maybeSingle();
          return { ...review, user_name: profile?.name || "Anonymous" };
        })
      );
      setReviews(reviewsWithNames);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });

      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            View user registrations, manage orders, and monitor activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">{pendingOrders} pending</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
              <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Logins / Registrations */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Logins & Registrations
              </CardTitle>
              <CardDescription>All registered users and their details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No users yet
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge variant="outline" className="mb-1">Active</Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders / Applications */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Orders & Applications
              </CardTitle>
              <CardDescription>Approve or reject customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No orders yet
                  </p>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{order.user_name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₦{formatPrice(order.total)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className="mb-1"
                          >
                            {order.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {order.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {order.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                            {order.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {order.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "completed")}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, "rejected")}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="bg-card/50 border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Recent Reviews
              </CardTitle>
              <CardDescription>Latest product reviews from customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4 col-span-2">
                    No reviews yet
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{review.user_name}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.review_text && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {review.review_text}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
