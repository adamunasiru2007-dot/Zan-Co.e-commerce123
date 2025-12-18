import { Product } from "@/types";

export const products: Product[] = [
  // Tees - Short Sleeve
  {
    id: "1",
    name: "Classic Black Tee",
    description: "Premium cotton short-sleeve t-shirt with a comfortable fit. Perfect for everyday wear.",
    price: 6000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    stock: 50,
    category: "Tees"
  },
  {
    id: "2",
    name: "Vintage White Tee",
    description: "Soft cotton short-sleeve tee with a relaxed fit. A wardrobe essential.",
    price: 6000,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=500&fit=crop",
    stock: 45,
    category: "Tees"
  },
  // Tees - Long Sleeve
  {
    id: "3",
    name: "Urban Long Sleeve",
    description: "Stylish long-sleeve tee made from premium fabric. Great for layering.",
    price: 8000,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
    stock: 40,
    category: "Tees"
  },
  // Jerseys
  {
    id: "4",
    name: "Sports Jersey Classic",
    description: "Breathable sports jersey with moisture-wicking technology. Perfect for game day.",
    price: 13000,
    image: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=500&h=500&fit=crop",
    stock: 30,
    category: "Jerseys"
  },
  {
    id: "5",
    name: "Retro Football Jersey",
    description: "Vintage-style football jersey with authentic design. Show your team spirit.",
    price: 13000,
    image: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500&h=500&fit=crop",
    stock: 25,
    category: "Jerseys"
  },
  // Accessories - Bracelets
  {
    id: "6",
    name: "Leather Wrist Bracelet",
    description: "Handcrafted leather bracelet with adjustable fit. Adds style to any outfit.",
    price: 3000,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
    stock: 100,
    category: "Accessories"
  },
  // Accessories - Rings
  {
    id: "7",
    name: "Minimalist Silver Ring",
    description: "Elegant silver-tone ring with a sleek, modern design.",
    price: 2000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
    stock: 80,
    category: "Accessories"
  },
  // Accessories - Chains
  {
    id: "8",
    name: "Cuban Link Chain",
    description: "Premium Cuban link chain necklace. Bold statement piece.",
    price: 5000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    stock: 60,
    category: "Accessories"
  },
  // Caps
  {
    id: "9",
    name: "Snapback Cap",
    description: "Classic snapback cap with adjustable strap. Street style essential.",
    price: 10000,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop",
    stock: 70,
    category: "Caps"
  },
  {
    id: "10",
    name: "Dad Hat Classic",
    description: "Comfortable dad hat with curved brim. Perfect for casual looks.",
    price: 10000,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop",
    stock: 55,
    category: "Caps"
  },
  // Shoes
  {
    id: "11",
    name: "Urban Sneakers",
    description: "Premium leather sneakers with comfortable cushioning. Style meets comfort.",
    price: 50000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    stock: 20,
    category: "Shoes"
  },
  {
    id: "12",
    name: "Classic White Kicks",
    description: "Clean white sneakers with minimalist design. Goes with everything.",
    price: 50000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    stock: 15,
    category: "Shoes"
  },
  // Jeans
  {
    id: "13",
    name: "Slim Fit Jeans",
    description: "Premium denim jeans with a modern slim fit. Comfortable stretch fabric.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    stock: 35,
    category: "Jeans"
  },
  {
    id: "14",
    name: "Classic Blue Denim",
    description: "Timeless blue jeans with straight leg cut. Built to last.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&h=500&fit=crop",
    stock: 40,
    category: "Jeans"
  }
];

export const categories = ["All", "Tees", "Jerseys", "Accessories", "Caps", "Shoes", "Jeans"];