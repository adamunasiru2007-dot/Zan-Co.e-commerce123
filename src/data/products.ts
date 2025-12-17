import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds Pro",
    description: "Premium wireless earbuds with active noise cancellation, 24-hour battery life, and crystal-clear audio quality.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
    stock: 50,
    category: "Electronics"
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with advanced sensors, GPS, and a stunning AMOLED display.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    stock: 30,
    category: "Electronics"
  },
  {
    id: "3",
    name: "Premium Backpack",
    description: "Durable, water-resistant backpack with laptop compartment and ergonomic design for everyday use.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    stock: 100,
    category: "Accessories"
  },
  {
    id: "4",
    name: "Minimalist Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness and color temperature for optimal workspace lighting.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    stock: 75,
    category: "Home"
  },
  {
    id: "5",
    name: "Organic Coffee Beans",
    description: "Premium single-origin coffee beans, ethically sourced and freshly roasted for the perfect cup.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
    stock: 200,
    category: "Food"
  },
  {
    id: "6",
    name: "Ceramic Plant Pot Set",
    description: "Set of 3 minimalist ceramic pots in various sizes, perfect for indoor plants and succulents.",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",
    stock: 60,
    category: "Home"
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek, compact design.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=500&h=500&fit=crop",
    stock: 120,
    category: "Electronics"
  },
  {
    id: "8",
    name: "Yoga Mat Premium",
    description: "Eco-friendly, non-slip yoga mat with extra cushioning for comfort during your practice.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    stock: 80,
    category: "Fitness"
  }
];

export const categories = ["All", "Electronics", "Accessories", "Home", "Food", "Fitness"];
