"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "./NavIcons";
import { getCartItems } from "../../productId/cart/_cart-actions/get-cart-items";
import { updateCartItem } from "../../productId/cart/_cart-actions/update-cart";
import { clearCart } from "../../productId/cart/_cart-actions/clear-cart";

// Match this interface with your server action
interface CartItemWithDetails {
  id: string;
  variationId: string;
  quantity: number;
  variation: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    product: {
      id: string;
      productName: string; // Using productName instead of name
      productImgUrl: string; // Using productImgUrl
    };
  };
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartRef: React.RefObject<HTMLDivElement>;
  itemCount?: number;
}

const CartItemComponent = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItemWithDetails;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-700">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
        {item.variation.imageUrl ? (
          <Image
            src={item.variation.imageUrl}
            alt={item.variation.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : item.variation.product.productImgUrl ? (
          <Image
            src={item.variation.product.productImgUrl}
            alt={item.variation.product.productName}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="flex-grow">
        <Link
          href={`/products/${item.variation.product.id}`} // Using product ID instead of slug
          className="text-white hover:text-red-400 font-medium transition-colors"
        >
          {item.variation.product.productName}
        </Link>
        <p className="text-sm text-gray-400">{item.variation.name}</p>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-red-400">${item.variation.price.toFixed(2)}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-600 text-gray-300 hover:border-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              -
            </button>

            <span className="w-8 text-center text-white">{item.quantity}</span>

            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.variation.quantity}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-600 text-gray-300 hover:border-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              +
            </button>

            <button
              onClick={() => onRemove(item.id)}
              className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = ({ isOpen, onClose, cartRef, itemCount = 0 }: CartProps) => {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError("");

      try {
        const result = await getCartItems();

        if (result.success) {
          setCartItems(result.items || []);
        } else {
          setError(result.message || "Failed to load cart items");
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load your cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [isOpen]);

  // Calculate total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.variation.price,
    0,
  );

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      const result = await updateCartItem({
        cartItemId: itemId,
        quantity: newQuantity,
      });

      if (result.success) {
        // Update the local state to reflect changes immediately
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item,
          ),
        );
      } else {
        setError(result.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      const result = await updateCartItem({
        cartItemId: itemId,
        quantity: 0, // Setting to 0 removes the item
      });

      if (result.success) {
        // Remove item from local state immediately
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId),
        );
      } else {
        setError(result.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      const result = await clearCart();

      if (result.success) {
        setCartItems([]);
      } else {
        setError(result.message || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={cartRef}
      className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-gray-900 to-black border-l border-red-700 shadow-lg z-50 transition-transform duration-300 ease-in-out flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Your Cart {itemCount > 0 && <span>({itemCount})</span>}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-4">{error}</div>
          ) : cartItems.length === 0 ? (
            <div className="text-gray-300 text-center py-4">
              Your cart is currently empty.
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}

              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="mt-4 w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  disabled={isUpdating}
                >
                  Clear Cart
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer with totals and checkout button */}
      <div className="p-6 border-t border-gray-800">
        {cartItems.length > 0 && (
          <>
            <div className="flex justify-between mb-4">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white font-medium">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-md text-center font-medium transition-all duration-300 hover:shadow-lg"
              onClick={onClose}
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
