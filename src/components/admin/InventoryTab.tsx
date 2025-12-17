import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useUpdateProduct } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function InventoryTab() {
  const { data: products, isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  const totalProducts = products?.length || 0;
  const lowStockCount = products?.filter((p) => p.stock > 0 && p.stock <= 10).length || 0;
  const outOfStockCount = products?.filter((p) => p.stock === 0).length || 0;
  const totalValue = products?.reduce((sum, p) => sum + Number(p.price) * p.stock, 0) || 0;

  const handleUpdateStock = async (id: string) => {
    await updateProduct.mutateAsync({ id, stock: newStock });
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <span className="text-sm text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {!products?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No products to display.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const stockPercentage = Math.min((product.stock / 100) * 100, 100);
                  const stockStatus = product.stock === 0 ? "out" : product.stock <= 10 ? "low" : "ok";

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category && (
                          <Badge variant="secondary">{product.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress
                            value={stockPercentage}
                            className={`h-2 ${
                              stockStatus === "out"
                                ? "[&>div]:bg-destructive"
                                : stockStatus === "low"
                                ? "[&>div]:bg-yellow-500"
                                : ""
                            }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === product.id ? (
                          <Input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(Number(e.target.value))}
                            className="w-20 ml-auto"
                            min={0}
                          />
                        ) : (
                          <Badge
                            variant={
                              stockStatus === "out"
                                ? "destructive"
                                : stockStatus === "low"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {product.stock}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === product.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStock(product.id)}
                              disabled={updateProduct.isPending}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(product.id);
                              setNewStock(product.stock);
                            }}
                          >
                            Update Stock
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
