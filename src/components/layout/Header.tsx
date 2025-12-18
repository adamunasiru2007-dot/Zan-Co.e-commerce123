import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Search, Home, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow transition-transform group-hover:scale-105">
            <span className="text-lg font-bold text-primary-foreground">Z</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ZAN&CO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/#products">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </Link>
          <Link to="/about">
            <Button 
              variant={isActive("/about") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              About Us
            </Button>
          </Link>
          <Link to="/contact">
            <Button 
              variant={isActive("/contact") ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-scale-in">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="shadow-glow">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}