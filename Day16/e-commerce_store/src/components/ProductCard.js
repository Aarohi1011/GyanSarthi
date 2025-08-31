"use client"; // This must be a client component to use hooks and handle events

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext'; // Import the useCart hook
import { toast, Toaster } from 'react-hot-toast'; // For "Added to cart" notifications

export default function ProductCard({ product, viewMode = 'grid' }) {
  // Use the addToCart function from our cart context
  const { addToCart } = useCart();

  // Handler to add the product to the cart and show a notification
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent default link behavior if nested
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  // Render rating stars (no changes to this function)
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-400" />); // Simple half-star representation
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center mt-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-500 ml-2">({product.rating?.count || 0})</span>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <>
        {/* Toaster for notifications */}
        <Toaster position="bottom-center" />
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row w-full">
          {/* Product Image */}
          <Link href={`/product/${product.id}`} className="md:w-1/4 h-48 relative block">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-4"
              priority={product.id <= 4}
            />
          </Link>

          {/* Product Details */}
          <div className="p-6 flex-grow flex flex-col justify-between">
            <div>
              <Link href={`/product/${product.id}`}>
                <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600">{product.title}</h2>
              </Link>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              {product.rating && renderRating(product.rating.rate)}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-2xl font-bold text-green-700">${product.price.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-300"
                  aria-label="Add to Cart"
                >
                  <FiShoppingCart />
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default grid view
  return (
    <>
      <Toaster position="bottom-center" />
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
        {/* Product Image and Link */}
        <Link href={`/product/${product.id}`} className="block h-56 relative overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              priority={product.id <= 4}
            />
            <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all duration-300">
              <FiHeart />
            </button>
        </Link>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow">
          {product.category && (
            <span className="text-xs text-gray-500 mb-1">{product.category}</span>
          )}
          <Link href={`/product/${product.id}`}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">{product.title}</h2>
          </Link>
          {product.rating && renderRating(product.rating.rate)}
          
          <div className="mt-auto pt-4">
            <p className="text-xl font-bold text-green-700 mb-4">${product.price.toFixed(2)}</p>
            
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors duration-300"
              aria-label="Add to Cart"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}