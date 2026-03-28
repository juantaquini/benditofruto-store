"use client";

import { useCart } from "@/context/CartContext";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(variantId)}
      className="bg-foreground px-4 py-1 text-white cursor-pointer flex items-center gap-2"
    >
      <div className="md:hidden flex items-center gap-2">
        <PlusIcon className="w-4 h-4" /> AGREGAR
      </div>
      <div className="hidden md:block">
        AGREGAR AL CARRITO
      </div>
    </button>
  );
}
