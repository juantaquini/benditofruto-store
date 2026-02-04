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
    "inline-block whitespace-nowrap text-sm font-medium uppercase transition duration-200 py-2 rounded";
  const activeClass = "-translate-y-3";

  // ✅ Ordenar colecciones alfabéticamente por title
  const sortedCollections = collections
    ? [...collections].sort((a, b) => a.node.title.localeCompare(b.node.title))
    : [];

  // ✅ Ordenar tags alfabéticamente
  const sortedTags = tags ? [...tags].sort((a, b) => a.localeCompare(b)) : [];

  return (
    <nav className="flex flex-row md:flex-wrap gap-x-8 gap-y-2 overflow-x-auto md:overflow-visible md:pt-8 pt-4 scroll-smooth justify-start md:justify-center w-full">
      {/* Mode: List Collections */}
      {collections && (
        <>
          <Link
            href="/collections"
            className={`${linkClass} ${showAll ? activeClass : ""}`}
          >
            New In
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
            New In
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
