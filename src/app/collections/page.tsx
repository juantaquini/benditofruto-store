import { getCollections, getProducts } from "@/lib/shopify";
import CollectionsNav from "@/components/collections/CollectionsNav";
import ProductCard from "@/components/products/ProductCard";

export default async function CollectionsPage() {
  const data = await getCollections();
  const collections = data.collections?.edges ?? [];
  
  // Obtener todos los productos para mostrar en "All"
  const productsData = await getProducts();
  const products = productsData.products?.edges ?? [];

  return (
    <>
      <CollectionsNav collections={collections} showAll={true} />
      
      {/* Grid de productos */}
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 pt-8 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        {products.map(({ node: product }) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}