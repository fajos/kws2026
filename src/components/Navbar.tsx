"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-emerald-950/90 border-b border-amber-400/30 text-white shadow-xl shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Organizer */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-900 border border-amber-400/50 p-1 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-amber-400/10">
              <Image
                src="/images/logo.png"
                alt="Finish Rich Africa - KWS 2026 Logo"
                fill
                sizes="(max-width: 640px) 48px, 64px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-extrabold tracking-wider uppercase border border-amber-400/30">
                  FRA Presents
                </span>
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                KWS 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-emerald-100/90">
            <Link href="/#about" className="hover:text-amber-300 transition-colors">
              About
            </Link>
            <Link href="/#activities" className="hover:text-amber-300 transition-colors">
              Summit Activities
            </Link>
            <Link href="/#convener" className="hover:text-amber-300 transition-colors">
              Convener
            </Link>
            <Link href="/#speakers" className="hover:text-amber-300 transition-colors">
              Speakers
            </Link>
            <Link href="/#venue" className="hover:text-amber-300 transition-colors">
              Venue
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/register"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-emerald-950 btn-gold-3d transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-400/20 bg-emerald-950 px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-medium text-emerald-100">
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 py-1"
            >
              About
            </Link>
            <Link
              href="/#activities"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 py-1"
            >
              Summit Activities
            </Link>
            <Link
              href="/#convener"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 py-1"
            >
              Convener
            </Link>
            <Link
              href="/#speakers"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 py-1"
            >
              Speakers
            </Link>
            <Link
              href="/#venue"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 py-1"
            >
              Venue &amp; Location
            </Link>
          </nav>
          <div className="pt-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-emerald-950 btn-gold-3d text-center"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
