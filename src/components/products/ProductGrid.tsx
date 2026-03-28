import ProductCard from "./ProductCard";
import type { ShopifyProduct } from "@/types/shopify";

type Props = { products: { node: ShopifyProduct }[] };

export default function ProductGrid({ products }: Props) {

  return (
    <section>
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
        {products.map(({ node }) => (
          <ProductCard key={node.id} product={node} />
        ))}
      </div>
    </section>
  );
}
