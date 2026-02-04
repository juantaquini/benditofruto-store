"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import Container from "@/components/ui/Container";

export default function CartPage() {
  const { lines, fetchCart, checkoutUrl, totalQuantity } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Container className="max-w-3xl h-[100vh] w-full flex flex-col justify-center items-center">
      <h1 className="mb-2 text-2xl font-small md:mb-8 border-b border-foreground w-full text-center pb-4 md:pb-8">
        Tu Carrito
      </h1>
      {lines.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="w-full max-h-[50vh] overflow-auto">
            {lines.map((item) => (
              <CartItem key={item.node.id} item={item} />
            ))}
          </div>

          <div className="md:mt-10 mt-4 flex flex-col gap-4 justify-between items-center w-full">
            <p className="text-center">
              Impuestos y envío calculados al finalizar la compra.
            </p>
            <button
              onClick={() => (window.location.href = checkoutUrl!)}
              className="bg-foreground text-white px-6 py-3 w-full"
            >
              FINALIZAR COMPRA
            </button>
          </div>
        </>
      )}
    </Container>
  );
}
