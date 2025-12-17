import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

export function OrdersTab() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateStatus.mutateAsync({ id: orderId, status });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders ({orders?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {!orders?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No orders yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.profiles?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.order_items?.length || 0} item(s)
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${Number(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge variant={statusColors[order.status] || "secondary"}>
                            {order.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
