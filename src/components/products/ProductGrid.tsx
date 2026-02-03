import ProductCard from "./ProductCard";
import type { ShopifyProduct } from "@/types/shopify";

type Props = { products: { node: ShopifyProduct }[] };

export default function ProductGrid({ products }: Props) {

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        {products.map(({ node }) => (
          <ProductCard key={node.id} product={node} />
        ))}
      </div>
    </section>
  );
}
