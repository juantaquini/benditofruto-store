"use client";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

export default function CartPreview() {
  const { lines, updateItem, removeItem, checkoutUrl } = useCart();

  // Calculate subtotal
  const subtotal = lines.reduce((acc, item) => {
    const price = parseFloat(item.node.merchandise.price.amount);
    const quantity = item.node.quantity;
    return acc + price * quantity;
  }, 0);

  const currencyCode = lines[0]?.node.merchandise.price.currencyCode || "EUR";

  return (
    <div className="absolute right-0 top-10 md:w-[400px] w-[310] border-foreground border-1 bg-white shadow-2xl overflow-hidden">
      {/* Cart Items */}
      <div className="max-h-[400px] overflow-y-auto p-4">
        {lines.map((item) => {
          const variant = item.node.merchandise;
          const quantity = item.node.quantity;
          const available = variant.quantityAvailable ?? 0;

          return (
            <div key={item.node.id} className="flex gap-3 py-3">
              {/* Product Image */}
              <div className="relative w-20 h-20 flex-shrink-0 bg-white border border-neutral-200">
                <Image
                  src={variant.image?.url || "/placeholder.png"}
                  alt={variant.product.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {variant.product.title}
                  </h4>
                  {/* Price */}
                  <span className="text-sm font-medium">
                    {parseFloat(variant.price.amount).toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {variant.price.currencyCode}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => removeItem(item.node.id)}
                    className="text-xs text-foreground hover:text-red-600 transition-colors mt-1 text-left uppercase tracking-wider cursor-pointer"
                  >
                    ELIMINAR
                  </button>
                  <div className="flex items-center border border-foreground w-fit">
                    <button
                      onClick={() => {
                        if (quantity > 1) {
                          updateItem(item.node.id, quantity - 1);
                        }
                      }}
                      className="px-2 py-1 border-r border-foreground cursor-pointer text-foreground hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="h-3 w-3" />
                    </button>
                    <span className="px-2 py-1 flex items-center justify-center min-w-[2rem] text-sm text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (available && quantity >= available) return;
                        updateItem(item.node.id, quantity + 1);
                      }}
                      className="px-2 py-1 border-l border-foreground cursor-pointer text-foreground hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed"
                      disabled={available && quantity >= available}
                    >
                      <PlusIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mb-4 px-4">
        <span className="text-sm font-medium uppercase tracking-wider">
          SUBTOTAL
        </span>
        <span className="text-sm font-medium">
          {subtotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })}{" "}
          {currencyCode}
        </span>
      </div>

      <button
        onClick={() => (window.location.href = checkoutUrl!)}
        className="w-full bg-foreground hover:bg-[#1f2a6b] text-white py-3 text-sm font-medium uppercase tracking-wider transition-colors cursor-pointer"
      >
        FINALIZAR COMPRA
      </button>
    </div>
  );
}
