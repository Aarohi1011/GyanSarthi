import { NextResponse } from 'next/server';

// Expanded mock product data with working images
const products = [
  {
    id: 1,
    title: "Classic Cotton T-Shirt",
    description: "A timeless classic, this t-shirt is made from 100% premium cotton for ultimate comfort. Perfect for everyday wear.",
    price: 25.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Denim Blue Jeans",
    description: "Perfectly tailored denim jeans that offer both style and durability. A wardrobe essential.",
    price: 79.50,
    image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    title: "Running Sneakers",
    description: "Lightweight and breathable sneakers designed for runners, providing maximum comfort and support.",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1709258228137-19a8c193be39?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cnVubmluZyUyMHNuZWFrZXJzfGVufDB8fDB8fHwy"
  },
  {
    id: 4,
    title: "Elegant Leather Watch",
    description: "A sophisticated watch with a genuine leather strap and stainless steel case. Water-resistant and timeless.",
    price: 250.00,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Durable Travel Backpack",
    description: "A spacious and durable backpack with multiple compartments, perfect for travel or daily commutes.",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1681334921874-5bafe8acf433?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RHVyYWJsZSUyMFRyYXZlbCUyMEJhY2twYWNrfGVufDB8fDB8fHwy"
  },
  {
    id: 6,
    title: "Cozy Wool Hoodie",
    description: "Stay warm and stylish with this ultra-soft wool hoodie. Ideal for chilly evenings.",
    price: 65.99,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "Slim Fit Formal Shirt",
    description: "A sleek formal shirt made with breathable fabric, perfect for office and business meetings.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "Leather Wallet",
    description: "Minimalist genuine leather wallet with multiple card slots and RFID protection.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TGVhdGhlciUyMHdhbGxldHxlbnwwfHwwfHx8Mg%3D%3D"
  },
  {
    id: 9,
    title: "Wireless Bluetooth Headphones",
    description: "Noise-cancelling over-ear headphones with 30 hours battery life and immersive sound.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505739718967-6df30ff369c7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFdpcmVsZXNzJTIwYmx1ZXRvb3RoJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8Mg%3D%3D"
  },
  {
    id: 10,
    title: "Smart Fitness Watch",
    description: "Track your workouts, heart rate, and sleep with this sleek smartwatch.",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1635863885627-3af06bb72087?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U21hcnQlMjBmaXRuZXNzJTIwd2F0Y2h8ZW58MHx8MHx8fDI%3D"
  },
  {
    id: 11,
    title: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches for ultimate gaming experience.",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2FtaW5nJTIwbWVjaGFuaWNhbCUyMGtleWJvYXJkfGVufDB8fDB8fHwy"
  },
  {
    id: 12,
    title: "Portable Bluetooth Speaker",
    description: "Compact and powerful wireless speaker with deep bass and waterproof design.",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UG9ydGFibGUlMjBCbHVldG9vdGglMjBzcGVha2VyfGVufDB8fDB8fHwy"
  },
  {
    id: 13,
    title: "Casual Canvas Shoes",
    description: "Stylish low-top canvas sneakers for everyday comfort.",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1617603280856-0ecabba82e09?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2FzdWFsJTIwQ2FudmFzJTIwc2hvZXxlbnwwfHwwfHx8Mg%3D%3D"
  },
  {
    id: 14,
    title: "Minimalist Desk Lamp",
    description: "LED desk lamp with touch controls, dimmable brightness, and modern design.",
    price: 60.00,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 15,
    title: "Classic Aviator Sunglasses",
    description: "Stylish aviator sunglasses with UV protection and lightweight frame.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 16,
    title: "Premium Leather Belt",
    description: "Durable leather belt with a classic buckle, perfect for formal or casual wear.",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1664286074240-d7059e004dff?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UHJlbWl1bSUyMExlYXRoZXIlMjBiZWx0fGVufDB8fDB8fHwy"
  },
  {
    id: 17,
    title: "Winter Knit Beanie",
    description: "Soft knitted beanie hat that keeps you cozy and stylish during winters.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 18,
    title: "Compact DSLR Camera",
    description: "High-quality DSLR camera with interchangeable lenses for professional photography.",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1628143642586-29eb7388839e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q29tcGFjdCUyMERTTFIlMjBDYW1lcmF8ZW58MHx8MHx8fDI%3D"
  },
  {
    id: 19,
    title: "Noise-Isolating Earbuds",
    description: "In-ear wired earbuds with crystal clear sound and deep bass.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1722439667098-f32094e3b1d4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fE5vaXNlJTIwSXNvbGF0aW5nJTIwRWFyYnVkc3xlbnwwfHwwfHx8Mg%3D%3D"
  },
  {
    id: 20,
    title: "Stylish Office Chair",
    description: "Ergonomic office chair with lumbar support and breathable mesh backrest.",
    price: 220.00,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
  }
];

/**
 * Handles GET requests to /api/products.
 * @returns {NextResponse} A JSON response containing the list of products.
 */
export async function GET() {
  return NextResponse.json(products);
}
