"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/SessionProvider";
import UserButton from "./UserButton";
import AuthModal from "@/app/(auth)/_components/AuthTabs";

const getRoutes = (isAuthenticated: boolean) => [
  { name: "Home", path: "/" },
  { name: "Headwear", path: "/headwear" },
  { name: "Apparel", path: "/apparel" },
  { name: "All Collections", path: "/all-collections" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const routes = getRoutes(!!user);

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

          {/* Auth Button */}
          <div className="ml-2 text-gray-300">
            {!user && <AuthModal />}
            {user && <UserButton />}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <div className="text-gray-300">
            {!user && <AuthModal />}
            {user && <UserButton />}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-red-600/20"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-gradient-to-b from-gray-900 to-black border-l border-red-700"
            >
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-md text-gray-300 transition-all duration-300
                      hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700"
                  >
                    {route.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
