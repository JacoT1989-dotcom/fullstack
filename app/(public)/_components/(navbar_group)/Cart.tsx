"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "./NavIcons";
import { useCart } from "../../productId/cart/_store/use-cart-store-hooks";
import { CartItemWithDetails } from "../../productId/cart/_store/cart-store";
import { useTierDiscount } from "../../(group-products)/_components/(filterside)/tier-util";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartRef: React.RefObject<HTMLDivElement>;
}

const CartItemComponent = ({
  item,
  onUpdateQuantity,
  onRemove,
  discountPercentage,
}: {
  item: CartItemWithDetails;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  discountPercentage: number;
}) => {
  // Calculate discounted price
  const originalPrice = item.variation.price;
  const discountedPrice = originalPrice * (1 - discountPercentage);
  const hasDiscount = discountPercentage > 0;

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
          href={`/products/${item.variation.product.id}`}
          className="text-white hover:text-red-400 font-medium transition-colors"
        >
          {item.variation.product.productName}
        </Link>
        <p className="text-sm text-gray-400">{item.variation.name}</p>
        <div className="mt-2 flex justify-between items-center">
          {hasDiscount ? (
            <div>
              <div className="text-red-400">R{discountedPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-500 line-through">
                R{originalPrice.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="text-red-400">R{originalPrice.toFixed(2)}</div>
          )}

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

const Cart = ({ isOpen, onClose, cartRef }: CartProps) => {
  const {
    items,
    itemCount,
    isLoading,
    updateCartItem,
    removeCartItem,
    clearCart,
    refreshCart,
    totalPrice,
    isEmpty,
  } = useCart();

  // Get tier discount information
  const { discountPercentage, hasDiscount, userTier } = useTierDiscount();

  // Calculate discounted total price
  const discountedTotalPrice = totalPrice * (1 - discountPercentage);

  // Reference to track if this is the first time opening
  const firstOpenRef = useRef(true);

  // Only do a background refresh when opening the cart
  useEffect(() => {
    if (isOpen) {
      // If this is the first open, do a background refresh
      // This ensures we don't hit the server redundantly
      if (firstOpenRef.current) {
        firstOpenRef.current = false;
        // Use false parameter to prevent loading state
        refreshCart(false);
      }
    }
  }, [isOpen, refreshCart]);

  // Format tier name for display
  const tierName = userTier.charAt(0) + userTier.slice(1).toLowerCase();

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

        {/* Display tier badge if user has a discount */}
        {hasDiscount && (
          <div className="mt-2 py-1 px-2 bg-red-600/20 border border-red-500/30 rounded text-sm text-red-400">
            {tierName} tier: {Math.round(discountPercentage * 100)}% discount
            applied
          </div>
        )}
      </div>

      {/* Cart Content */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          {/* Only show loading indicator during explicit loading operations (not on open) */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
            </div>
          )}

          {isEmpty ? (
            <div className="text-gray-300 text-center py-4">
              Your cart is currently empty.
            </div>
          ) : (
            <>
              {items.map((item: CartItemWithDetails) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateCartItem}
                  onRemove={removeCartItem}
                  discountPercentage={discountPercentage}
                />
              ))}

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="mt-4 w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  disabled={isLoading}
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
        {!isEmpty && (
          <>
            {hasDiscount ? (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Original Subtotal</span>
                  <span className="text-gray-400 line-through">
                    R{totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{tierName} Discount</span>
                  <span className="text-red-400">
                    -R{(totalPrice - discountedTotalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-white">Final Subtotal</span>
                  <span className="text-white">
                    R{discountedTotalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between mb-4">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white font-medium">
                  R{totalPrice.toFixed(2)}
                </span>
              </div>
            )}

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
