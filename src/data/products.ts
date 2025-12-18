import { Product } from "@/types";

// Import product images
import teesBlackWhite from "@/assets/products/tees-black-white.jpg";
import teesLongsleeve from "@/assets/products/tees-longsleeve.jpg";
import jerseyEngland from "@/assets/products/jersey-england-blue.jpeg";
import jerseyMilan from "@/assets/products/jersey-milan-white.jpeg";
import jerseySantos from "@/assets/products/jersey-santos.jpeg";
import jerseyManutd from "@/assets/products/jersey-manutd-collection.jpeg";
import braceletColorful from "@/assets/products/bracelet-colorful.jpg";
import ringsGemstone from "@/assets/products/rings-gemstone.jpg";
import chainCuban from "@/assets/products/chain-cuban.webp";
import capBlack from "@/assets/products/cap-black.png";
import capWhite from "@/assets/products/cap-white.webp";
import shoesWhiteAf1 from "@/assets/products/shoes-white-af1.webp";
import shoesBlackFormal from "@/assets/products/shoes-black-formal.webp";
import jeansBlue from "@/assets/products/jeans-blue.jpg";
import jeansGrey from "@/assets/products/jeans-grey.jpg";

export const products: Product[] = [
  // Tees - Short Sleeve
  {
    id: "1",
    name: "Classic Black Tee",
    description: "Premium cotton short-sleeve t-shirt with a comfortable fit. Perfect for everyday wear.",
    price: 6000,
    image: teesBlackWhite,
    stock: 50,
    category: "Tees"
  },
  {
    id: "2",
    name: "Vintage White Tee",
    description: "Soft cotton short-sleeve tee with a relaxed fit. A wardrobe essential.",
    price: 6000,
    image: teesBlackWhite,
    stock: 45,
    category: "Tees"
  },
  // Tees - Long Sleeve
  {
    id: "3",
    name: "Urban Long Sleeve",
    description: "Stylish long-sleeve tee made from premium fabric. Great for layering.",
    price: 8000,
    image: teesLongsleeve,
    stock: 40,
    category: "Tees"
  },
  // Jerseys
  {
    id: "4",
    name: "England Pre-Match Jersey",
    description: "Breathable sports jersey with moisture-wicking technology. Perfect for game day.",
    price: 13000,
    image: jerseyEngland,
    stock: 30,
    category: "Jerseys"
  },
  {
    id: "5",
    name: "AC Milan Away Jersey",
    description: "Premium football jersey with authentic design. Show your team spirit.",
    price: 13000,
    image: jerseyMilan,
    stock: 25,
    category: "Jerseys"
  },
  {
    id: "15",
    name: "Santos FC Home Jersey",
    description: "Classic striped football jersey. Authentic Brazilian club style.",
    price: 13000,
    image: jerseySantos,
    stock: 20,
    category: "Jerseys"
  },
  {
    id: "16",
    name: "Man United Collection",
    description: "Premium Manchester United jerseys. Home, away, and third kit available.",
    price: 13000,
    image: jerseyManutd,
    stock: 35,
    category: "Jerseys"
  },
  // Accessories - Bracelets
  {
    id: "6",
    name: "Colorful Beaded Bracelet",
    description: "Handcrafted beaded bracelet with vibrant colors. Adds style to any outfit.",
    price: 3000,
    image: braceletColorful,
    stock: 100,
    category: "Accessories"
  },
  // Accessories - Rings
  {
    id: "7",
    name: "Gemstone Statement Ring",
    description: "Elegant vintage-style ring with beautiful gemstones. Bold statement piece.",
    price: 2000,
    image: ringsGemstone,
    stock: 80,
    category: "Accessories"
  },
  // Accessories - Chains
  {
    id: "8",
    name: "Cuban Link Chain",
    description: "Premium Cuban link chain necklace. Bold statement piece.",
    price: 5000,
    image: chainCuban,
    stock: 60,
    category: "Accessories"
  },
  // Caps
  {
    id: "9",
    name: "Classic Black Cap",
    description: "Classic cap with adjustable strap. Street style essential.",
    price: 10000,
    image: capBlack,
    stock: 70,
    category: "Caps"
  },
  {
    id: "10",
    name: "Classic White Cap",
    description: "Clean white cap with curved brim. Perfect for casual looks.",
    price: 10000,
    image: capWhite,
    stock: 55,
    category: "Caps"
  },
  // Shoes
  {
    id: "11",
    name: "White Air Force 1",
    description: "Premium leather sneakers with comfortable cushioning. Style meets comfort.",
    price: 50000,
    image: shoesWhiteAf1,
    stock: 20,
    category: "Shoes"
  },
  {
    id: "12",
    name: "Classic Black Oxford",
    description: "Elegant black formal shoes with premium leather. Goes with everything.",
    price: 50000,
    image: shoesBlackFormal,
    stock: 15,
    category: "Shoes"
  },
  // Jeans
  {
    id: "13",
    name: "Classic Blue Denim",
    description: "Premium denim jeans with a modern fit. Comfortable stretch fabric.",
    price: 15000,
    image: jeansBlue,
    stock: 35,
    category: "Jeans"
  },
  {
    id: "14",
    name: "Vintage Grey Jeans",
    description: "Wrangler style grey jeans with straight leg cut. Built to last.",
    price: 15000,
    image: jeansGrey,
    stock: 40,
    category: "Jeans"
  }
];

export const categories = ["All", "Tees", "Jerseys", "Accessories", "Caps", "Shoes", "Jeans"];
