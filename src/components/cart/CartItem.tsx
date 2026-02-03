import { useCart } from "@/context/CartContext";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function CartItem({ item }: { item: any }) {
  const { updateItem, removeItem } = useCart();
  const variant = item.node.merchandise;
  const quantity = item.node.quantity;
  const available = variant.quantityAvailable ?? 0;
  const remaining = available - quantity;

  const handleDecrement = () => {
    if (quantity > 1) {
      updateItem(item.node.id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (available && quantity >= available) return;
    updateItem(item.node.id, quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.node.id);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-foreground">
      <Image
        src={variant.image?.url}
        alt={variant.image?.altText || variant.product.title}
        width={96}
        height={96}
        className="h-34 w-34 object-contain"
      />

      <div className="flex flex-col md:flex-row justify-between items-center flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium">{variant.product.title}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex border border-foreground w-fit">
              <button
                onClick={handleDecrement}
                className="px-2 py-1 border-r border-foreground cursor-pointer text-foreground hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </button>

              <span className="px-2 py-1 flex items-center justify-center min-w-[2.5rem] text-sm text-foreground">
                {quantity}
              </span>

              <button
                onClick={handleIncrement}
                className="px-2 py-1 border-l border-foreground cursor-pointer text-foreground hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed"
                disabled={available && quantity >= available}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Dynamic stock messages */}
            {remaining <= 0 ? (
              <span className="text-xs text-red-600">
                No more stock available
              </span>
            ) : remaining <= 5 ? (
              <span className="text-xs text-yellow-600">
                Only {remaining} unit{remaining > 1 ? "s" : ""} left
              </span>
            ) : null}

            <button
              onClick={handleRemove}
              className="text-xs uppercase tracking-wider text-left text-foreground hover:text-black transition-colors w-fit cursor-pointer"
            >
              Remove
            </button>
          </div>

          <span className="font-medium md:min-w-[6rem]">
            {parseFloat(variant.price.amount).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            {variant.price.currencyCode}
          </span>
        </div>
      </div>
    </div>
  );
}
