import { getCollectionByHandle } from "@/lib/shopify";
import ProductGrid from "@/components/products/ProductGrid";
import CollectionsNav from "@/components/collections/CollectionsNav";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ tag?: string }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { tag } = (searchParams ? await searchParams : {}) as { tag?: string };
  const data = await getCollectionByHandle(handle);

  const edges = data.collection.products.edges;

  const tags = Array.from(
    new Set(edges.flatMap(({ node }) => (node.tags ?? [])).filter(Boolean))
  ).sort();

  const filteredProducts = tag
    ? edges.filter(({ node }) => (node.tags ?? []).includes(tag))
    : edges;

  return (
    <div className="flex flex-col gap-12">
      <CollectionsNav
        tags={tags}
        collectionHandle={handle}
        currentTag={tag}
      />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}