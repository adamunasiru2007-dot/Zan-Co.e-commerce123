import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: Map<string, { user: User; password: string }> = new Map();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const userData = mockUsers.get(email);
    if (userData && userData.password === password) {
      setUser(userData.user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.user.name}`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (mockUsers.has(email)) {
      toast({
        title: "Registration failed",
        description: "Email already exists",
        variant: "destructive",
      });
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: "USER",
    };

    mockUsers.set(email, { user: newUser, password });
    setUser(newUser);
    
    toast({
      title: "Welcome!",
      description: "Your account has been created successfully",
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
