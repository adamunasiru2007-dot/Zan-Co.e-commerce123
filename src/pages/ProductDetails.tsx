import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Truck } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ProductOptions, defaultSizes, defaultColors } from "@/components/products/ProductOptions";
import { ReviewSection } from "@/components/products/ReviewSection";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG").format(price);
};

// Category-specific options
const categoryOptions: Record<string, { sizes: string[]; colors: typeof defaultColors }> = {
  Tees: {
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: defaultColors,
  },
  Jerseys: {
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Home", hex: "#1e3a5f" },
      { name: "Away", hex: "#ffffff" },
      { name: "Third", hex: "#1a1a1a" },
    ],
  },
  Jeans: {
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Blue", hex: "#1e40af" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Grey", hex: "#6b7280" },
    ],
  },
  Caps: {
    sizes: ["One Size"],
    colors: defaultColors.slice(0, 4),
  },
  Shoes: {
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#1a1a1a" },
    ],
  },
  Accessories: {
    sizes: [],
    colors: [
      { name: "Gold", hex: "#d4af37" },
      { name: "Silver", hex: "#c0c0c0" },
      { name: "Rose Gold", hex: "#b76e79" },
    ],
  },
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="shadow-glow">Back to Shop</Button>
        </div>
      </Layout>
    );
  }

  const options = categoryOptions[product.category] || { sizes: [], colors: [] };
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    // Validate selections if options are available
    if (options.sizes.length > 0 && !selectedSize) {
      return;
    }
    if (options.colors.length > 0 && !selectedColor) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize || undefined, selectedColor || undefined);
    }
    setQuantity(1);
  };

  const canAddToCart =
    !isOutOfStock &&
    (options.sizes.length === 0 || selectedSize) &&
    (options.colors.length === 0 || selectedColor);

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
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/50 animate-fade-in">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <Badge className="absolute left-4 top-4 bg-primary/90">
              {product.category}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="flex flex-col animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">
              ₦{formatPrice(product.price)}
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
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {product.stock} in stock
                </Badge>
              )}
            </div>

            {!isOutOfStock && (
              <>
                {/* Size & Color Options */}
                {(options.sizes.length > 0 || options.colors.length > 0) && (
                  <div className="mb-6">
                    <ProductOptions
                      sizes={options.sizes}
                      colors={options.colors}
                      selectedSize={selectedSize}
                      selectedColor={selectedColor}
                      onSizeChange={setSelectedSize}
                      onColorChange={setSelectedColor}
                    />
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="border-border/50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="border-border/50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  size="lg"
                  className="w-full md:w-auto gap-2 shadow-glow"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {!canAddToCart
                    ? "Select options"
                    : `Add to Cart - ₦${formatPrice(product.price * quantity)}`}
                </Button>
              </>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-border/50 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <span>Free shipping on orders over ₦30,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />
      </div>
    </Layout>
  );
}
