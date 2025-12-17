import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profiles?: { name: string; email: string } | null;
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`*, order_items (*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(orders.map(o => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, email")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return orders.map(order => ({
        ...order,
        profiles: profileMap.get(order.user_id) || null,
      })) as Order[];
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order status updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
