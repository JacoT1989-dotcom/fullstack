"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/app/SessionProvider";
import UserButton from "./UserButton";

// Import icons directly or use a simple SVG implementation
const MenuIcon = () => (
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
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
);

const CartIcon = () => (
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
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const getRoutes = () => [
  { name: "Home", path: "/" },
  { name: "Headwear", path: "/headwear" },
  { name: "Apparel", path: "/apparel" },
  { name: "All Collections", path: "/all-collections" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useSession();

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const cartMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu if clicking outside
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }

      // Close cart menu if clicking outside
      if (
        cartOpen &&
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target as Node) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        setCartOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, cartOpen]);

  const routes = getRoutes();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-b from-gray-900 to-black shadow-lg border-b border-red-700"
          : "bg-gradient-to-b from-gray-900 to-black"
      }`}
    >
      <nav className="container mx-auto px-7 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_gh.png"
            alt="Genius Humans Logo"
            width={250}
            height={45}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="px-4 py-2 rounded-md text-gray-300 transition-all duration-300 
                hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700 
                hover:scale-105 font-medium"
            >
              {route.name}
            </Link>
          ))}

          {/* Cart Icon for logged-in users - Desktop */}
          {user && (
            <div className="relative">
              <button
                ref={cartButtonRef}
                onClick={() => setCartOpen(!cartOpen)}
                className="ml-2 p-2 rounded-md text-gray-300 hover:text-white hover:bg-red-600/20"
              >
                <CartIcon />
                <span className="sr-only">Open cart</span>
              </button>

              {/* Custom Cart Sidebar */}
              {cartOpen && (
                <div
                  ref={cartMenuRef}
                  className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-gray-900 to-black border-l border-red-700 shadow-lg z-50 transition-transform duration-300 ease-in-out"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">
                        Your Cart
                      </h2>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-gray-300 hover:text-white"
                      >
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
                      <p className="text-gray-300">
                        Your cart is currently empty.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auth Button */}
          <div className="ml-2 text-gray-300">
            {!user ? (
              <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                Sign In
              </button>
            ) : (
              <UserButton />
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {/* Cart Icon for logged-in users - Mobile */}
          {user && (
            <div className="relative">
              <button
                ref={cartButtonRef}
                onClick={() => setCartOpen(!cartOpen)}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-red-600/20"
              >
                <CartIcon />
                <span className="sr-only">Open cart</span>
              </button>

              {/* Custom Cart Sidebar - Mobile */}
              {cartOpen && (
                <div
                  ref={cartMenuRef}
                  className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-gray-900 to-black border-l border-red-700 shadow-lg z-50 transition-transform duration-300 ease-in-out"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">
                        Your Cart
                      </h2>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-gray-300 hover:text-white"
                      >
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
                      <p className="text-gray-300">
                        Your cart is currently empty.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auth Button - Mobile */}
          <div className="text-gray-300">
            {!user ? (
              <button className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors text-sm">
                Sign In
              </button>
            ) : (
              <UserButton />
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-red-600/20"
          >
            <MenuIcon />
            <span className="sr-only">Toggle menu</span>
          </button>

          {/* Custom Mobile Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-gray-900 to-black border-l border-red-700 shadow-lg z-50 transition-transform duration-300 ease-in-out"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-white"
                  >
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
                <div className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-md text-gray-300 transition-all duration-300
                        hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700"
                    >
                      {route.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
