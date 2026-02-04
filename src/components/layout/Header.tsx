"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import CartPreview from "@/components/cart/CartPreview";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export default function Header() {
  const { totalQuantity, checkoutUrl, isCartOpen, openCart, closeCart } =
    useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = () => openCart();
  const handleMouseLeave = () => closeCart(300);

  return (
    <ClickAwayListener onClickAway={() => setMobileMenuOpen(false)}>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-colors duration-500 ease-in-out
          ${mobileMenuOpen ? "bg-white" : "bg-transparent"}
        `}
      >
        <Container className="py-4">
          <div className="flex h-16 items-center justify-between relative">
            {/* Mobile menu button */}
            <button
              className="md:hidden relative z-50 p-2 -m-2 touch-manipulation"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-8 w-8 text-foreground transition-transform duration-300 cursor-pointer" />
              ) : (
                <Bars3Icon className="h-8 w-8 text-foreground transition-transform duration-300 cursor-pointer" />
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="
                absolute left-1/2 -translate-x-1/2
                text-2xl font-medium tracking-widest
                md:static md:translate-x-0 md:flex-1
                z-40
              "
            >
              Bendito Fruto
            </Link>
            <nav className="hidden flex-1 justify-center md:flex">
              <Link className="px-4 py-2 font-medium" href="/collections">
                Productos
              </Link>
              <Link className="px-4 py-2 font-medium" href="/about">
                Sobre nosotros
              </Link>
              <Link className="px-4 py-2 font-medium" href="/contact">
                Contacto
              </Link>
            </nav>

            {/* Cart */}
            <div className="relative flex flex-1 justify-end">
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/cart" className="relative block">
                  <ShoppingBagIcon className="h-6 w-6 text-foreground" />
                  {totalQuantity > 0 && (
                    <span className="absolute -right-1 -top-4 text-xs">
                      {totalQuantity}
                    </span>
                  )}
                </Link>

                {totalQuantity > 0 && checkoutUrl && (
                  <div
                    className={`
                      absolute right-0 top-2 z-50
                      transition-all duration-300
                      ${
                        isCartOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }
                    `}
                  >
                    <div className="pt-2">
                      <CartPreview />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <nav
            className={`
              md:hidden absolute top-16 left-0 right-0
              bg-white border-b shadow-xl
              px-4 py-6
              flex flex-col space-y-4
              transform-gpu
              transition-all duration-500 ease-out delay-75
              ${
                mobileMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8 pointer-events-none"
              }
            `}
          >
            <Link href="/collections" onClick={() => setMobileMenuOpen(false)}>
              Productos
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              Sobre nosotros
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contacto
            </Link>
          </nav>
        </Container>
      </header>
    </ClickAwayListener>
  );
}
