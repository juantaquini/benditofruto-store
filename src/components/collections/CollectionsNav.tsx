import Link from "next/link";
import type { ShopifyCollection } from "@/types/shopify";

type Props = {
  collections?: { node: ShopifyCollection }[];
  tags?: string[];
  collectionHandle?: string;
  currentTag?: string;
  showAll?: boolean;
};

export default function CollectionsNav({
  collections,
  tags,
  collectionHandle,
  currentTag,
  showAll = false,
}: Props) {
  const linkClass =
    "inline-block whitespace-nowrap text-sm font-medium uppercase transition duration-200 px-4 py-2 rounded";
  const activeClass = "-translate-y-3";

  // ✅ Ordenar colecciones alfabéticamente por title
  const sortedCollections = collections
    ? [...collections].sort((a, b) => a.node.title.localeCompare(b.node.title))
    : [];

  // ✅ Ordenar tags alfabéticamente
  const sortedTags = tags ? [...tags].sort((a, b) => a.localeCompare(b)) : [];

  return (
    <nav className="flex overflow-x-auto py-8 scroll-smooth justify-start md:justify-center">
      {/* Mode: List Collections */}
      {collections && (
        <>
          <Link
            href="/collections"
            className={`${linkClass} ${showAll ? activeClass : ""}`}
          >
            All
          </Link>

          {sortedCollections.map(({ node }) => (
            <Link
              key={node.id}
              href={`/collections/${node.handle}`}
              className={`${linkClass} ${
                collectionHandle === node.handle && !showAll ? activeClass : ""
              }`}
            >
              {node.title}
            </Link>
          ))}
        </>
      )}

      {/* Mode: List Tags (inside a collection) */}
      {tags && collectionHandle && (
        <>
          <Link href="/collections" className={linkClass}>
            Back
          </Link>

          <Link
            href={`/collections/${collectionHandle}`}
            className={`${linkClass} ${!currentTag ? activeClass : ""}`}
          >
            All
          </Link>

          {sortedTags.map((tag) => (
            <Link
              key={tag}
              href={`/collections/${collectionHandle}?tag=${encodeURIComponent(
                tag
              )}`}
              className={`${linkClass} ${
                currentTag === tag ? activeClass : ""
              }`}
            >
              {tag}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
}
