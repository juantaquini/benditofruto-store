"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import {
  createCart,
  addToCart,
  getCart,
  updateCartLine,
  removeCartLine,
} from "@/lib/cart";

type CartContextType = {
  cartId: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: any[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: (delay?: number) => void;
  addItem: (variantId: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [lines, setLines] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ------------------------------ CART CONTROLS ------------------------------ */
  const openCart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsCartOpen(true);
  };

  const closeCart = (delay = 0) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsCartOpen(false);
      }, delay);
    } else {
      setIsCartOpen(false);
    }
  };

  /* ------------------------------ INIT CART ------------------------------ */
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");

    if (storedCartId) {
      setCartId(storedCartId);
    } else {
      createCart().then((data) => {
        const id = data.cartCreate.cart.id;
        const url = data.cartCreate.cart.checkoutUrl;

        localStorage.setItem("cartId", id);
        setCartId(id);
        setCheckoutUrl(url);
      });
    }
  }, []);

  /* ----------------------------- FETCH CART ------------------------------ */
  async function fetchCart() {
    if (!cartId) return;

    const data = await getCart(cartId);
    setLines(data.cart.lines.edges);
    setTotalQuantity(data.cart.totalQuantity);
    setCheckoutUrl(data.cart.checkoutUrl);
  }

  /* ------------------------------ ADD ITEM ------------------------------- */
  async function addItem(variantId: string) {
    if (!cartId) return;

    await addToCart(cartId, variantId);
    await fetchCart();
    openCart();
    closeCart(5000);
  }

  /* ----------------------------- UPDATE ITEM ----------------------------- */
  async function updateItem(lineId: string, quantity: number) {
    if (!cartId) return;
    await updateCartLine(cartId, lineId, quantity);
    fetchCart();
  }

  /* ----------------------------- REMOVE ITEM ----------------------------- */
  async function removeItem(lineId: string) {
    if (!cartId) return;
    await removeCartLine(cartId, lineId);
    fetchCart();
  }

  useEffect(() => {
    if (cartId) fetchCart();
  }, [cartId]);

  return (
    <CartContext.Provider
      value={{
        cartId,
        checkoutUrl,
        totalQuantity,
        lines,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
