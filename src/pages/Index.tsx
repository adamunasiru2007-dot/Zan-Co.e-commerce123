import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Get one featured product from each category
  const featuredProducts = useMemo(() => {
    const categoriesWithoutAll = categories.filter((cat) => cat !== "All");
    return categoriesWithoutAll.map((category) => {
      return products.find((product) => product.category === category);
    }).filter(Boolean);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-20 md:py-28">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Premium Quality Wears</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in">
            Welcome to <span className="text-gradient">ZAN&CO</span>
          </h1>
          
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            Your one-stop destination for affordable, stylish wears. From tees to sneakers, we've got you covered with quality fashion at prices you'll love.
          </p>
          
          <div
            className="relative max-w-md mx-auto animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-base bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 border-b border-border/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Featured <span className="text-gradient">Collection</span>
            </h2>
            <p className="text-muted-foreground">One from each category, handpicked for you</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              product && <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            All <span className="text-gradient">Products</span>
          </h2>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 ${
                  selectedCategory === category 
                    ? "shadow-glow" 
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </section>
    </Layout>
  );
};

export default Index;