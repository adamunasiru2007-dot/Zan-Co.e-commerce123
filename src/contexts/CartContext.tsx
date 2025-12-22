import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session, isAuthenticated } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (isAuthenticated && session?.user) {
      loadCartFromDatabase();
    } else {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem("zan-cart");
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch {
          setItems([]);
        }
      }
    }
  }, [isAuthenticated, session]);

  // Save cart to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("zan-cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const loadCartFromDatabase = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;

      // We'll need to map database cart items to Product objects
      // For now, store the raw data and match with products
      const cartItems: CartItem[] = [];
      
      // Import products data to match
      const { products } = await import("@/data/products");
      
      data?.forEach((dbItem) => {
        const product = products.find((p) => p.id === dbItem.product_id);
        if (product) {
          cartItems.push({
            product,
            quantity: dbItem.quantity,
            size: dbItem.size || undefined,
            color: dbItem.color || undefined,
          });
        }
      });

      setItems(cartItems);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCartToDatabase = async (newItems: CartItem[]) => {
    if (!session?.user) return;

    try {
      // Delete existing cart items
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", session.user.id);

      // Insert new cart items
      if (newItems.length > 0) {
        const cartData = newItems.map((item) => ({
          user_id: session.user.id,
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        }));

        await supabase.from("cart_items").insert(cartData);
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const addItem = useCallback((product: Product, size?: string, color?: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );
      
      let newItems: CartItem[];
      
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast({
            title: "Stock limit reached",
            description: "Cannot add more of this item",
            variant: "destructive",
          });
          return prev;
        }
        newItems = prev.map((item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prev, { product, quantity: 1, size, color }];
      }

      if (session?.user) {
        syncCartToDatabase(newItems);
      }

      return newItems;
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  }, [session]);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    setItems((prev) => {
      const newItems = prev.filter(
        (item) =>
          !(item.product.id === productId &&
            item.size === size &&
            item.color === color)
      );

      if (session?.user) {
        syncCartToDatabase(newItems);
      }

      return newItems;
    });
  }, [session]);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) return;
    
    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.product.id === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      );

      if (session?.user) {
        syncCartToDatabase(newItems);
      }

      return newItems;
    });
  }, [session]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (session?.user) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", session.user.id)
        .then();
    }
  }, [session]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
