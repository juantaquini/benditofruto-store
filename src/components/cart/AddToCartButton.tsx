"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(variantId)}
      className="bg-foreground px-4 py-1 text-white cursor-pointer"
    >
      AGREGAR AL CARRITO
    </button>
  );
}
