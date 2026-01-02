import { useState, useEffect, useRef } from "react";
import { Search, Loader2, PackageX } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function SearchDropdown() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    setHasSearched(true);

    // Simulate checking availability with a delay
    const timer = setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={isAuthenticated ? "Search products..." : "Login to search products..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.trim() && setIsOpen(true)}
          disabled={!isAuthenticated}
          className={`pl-12 h-14 text-base bg-card/50 border-border/50 focus:border-primary transition-all ${
            isAuthenticated ? "cursor-text" : "cursor-not-allowed opacity-70"
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && isAuthenticated && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Checking availability...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-3 py-2">
                {results.length} product{results.length !== 1 ? "s" : ""} found
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">₦{formatPrice(product.price)}</p>
                  </div>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </Link>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <PackageX className="h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground">Out of Stock</p>
              <p className="text-sm text-muted-foreground/70">
                No products found for "{search}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
