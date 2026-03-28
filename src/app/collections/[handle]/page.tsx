import { getCollectionByHandle, getCollections } from "@/lib/shopify";
import ProductGrid from "@/components/products/ProductGrid";
import CollectionsNav from "@/components/collections/CollectionsNav";

type Props = {
  params: Promise<{ handle: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const [data, collectionsData] = await Promise.all([
    getCollectionByHandle(handle),
    getCollections(),
  ]);

  const edges = data.collection.products.edges;
  const collections = collectionsData.collections?.edges ?? [];

  return (
    <div className="flex flex-col gap-12">
      <CollectionsNav
        collections={collections}
        collectionHandle={handle}
        showAll={false}
      />
      <ProductGrid products={edges} />
    </div>
  );
}