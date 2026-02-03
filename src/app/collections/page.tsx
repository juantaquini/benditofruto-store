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
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-8">
        {products.map(({ node: product }) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}