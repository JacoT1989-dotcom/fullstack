"use client";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartRef: React.RefObject<HTMLDivElement>;
  itemCount?: number;
}

const Cart = ({ isOpen, onClose, cartRef, itemCount = 0 }: CartProps) => {
  if (!isOpen) return null;

  return (
    <div
      ref={cartRef}
      className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-gray-900 to-black border-l border-red-700 shadow-lg z-50 transition-transform duration-300 ease-in-out"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Your Cart {itemCount > 0 && <span>({itemCount})</span>}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mt-8">
          {itemCount === 0 ? (
            <p className="text-gray-300">Your cart is currently empty.</p>
          ) : (
            <p className="text-gray-300">Your cart items will appear here.</p>
            // In a real implementation, you would render actual cart items here
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
