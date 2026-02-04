import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/types/shopify";

type Props = {
  product: ShopifyProduct;
};

export default function ProductCard({ product }: Props) {
  const image = product.images.edges[0]?.node;

  return (
    <Link href={`/products/${product.handle}`} className="group inline-block w-full">
      <div className="relative aspect-square w-full bg-white overflow-hidden">
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        )}
      </div>

      <div className="mt-2 space-y-0.5 text-center">
        <h2 className="text-sm font-medium ">{product.title}</h2>

        <p className="text-sm text-neutral-600 text-foreground">
          $
          {Number(product.priceRange.minVariantPrice.amount).toLocaleString(
            "es-AR"
          )}
        </p>
      </div>
    </Link>
  );
}
