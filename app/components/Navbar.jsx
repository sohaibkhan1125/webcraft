'use client'
import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Ensure Button is imported
import { ChevronDown, ArrowRight } from "lucide-react"; // ✅ Import missing icons
import Link from "next/link";

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('menu-button');
      if (isMenuOpen && menu && !menu.contains(event.target) && !button.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01bd7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
            </div>
            <div>
              <Link href="/">
              <span className="font-bold text-xl -ml-2">
                Web <span className="text-emerald-500">Craft Kit</span>
              </span>
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900">
              Terms and Conditions
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href='/contact'>
            <Button className="hidden md:flex items-center gap-1 cursor-pointer">
              <span>Contact Us</span>
              <ArrowRight size={16} />
            </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              id="menu-button"
              onClick={toggleMenu} 
              className="text-gray-600 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <path d="M3 6h18M3 12h18m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 z-50 md:hidden bg-white pt-16 pb-6 px-4 shadow-lg overflow-y-auto"
        >
          <div className="absolute top-4 right-4">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 p-2 focus:outline-none"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col items-center space-y-6 text-lg">
            <Link href="/" className="text-gray-600 hover:text-gray-900 w-full text-center py-3 border-b border-gray-100">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 w-full text-center py-3 border-b border-gray-100">
              About
            </Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 w-full text-center py-3 border-b border-gray-100">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900 w-full text-center py-3 border-b border-gray-100">
              Terms and Conditions
            </Link>
            <Link href='/contact' className="w-full text-center py-3">
              <Button className="w-full flex items-center justify-center gap-2">
                <span>Contact Us</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
