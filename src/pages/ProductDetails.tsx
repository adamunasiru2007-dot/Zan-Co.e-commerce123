import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Back to Shop</Button>
        </div>
      </Layout>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setQuantity(1);
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted animate-fade-in">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <Badge className="absolute left-4 top-4" variant="secondary">
              {product.category}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="flex flex-col animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="prose prose-muted mb-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : (
                <Badge variant="secondary" className="bg-success-light text-primary">
                  {product.stock} in stock
                </Badge>
              )}
            </div>

            {!isOutOfStock && (
              <>
                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  size="lg"
                  className="w-full md:w-auto gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              </>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-success-light flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
