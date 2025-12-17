import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);
  return <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in">ZAN&CO<span className="text-primary"></span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{
          animationDelay: "100ms"
        }}>Your one time stop for affordable wears.</p>
          <div className="relative max-w-md mx-auto animate-fade-in" style={{
          animationDelay: "200ms"
        }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-12 text-base" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container">
          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className="flex-shrink-0">
                {category}
              </Button>)}
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </section>
    </Layout>;
};
export default Index;