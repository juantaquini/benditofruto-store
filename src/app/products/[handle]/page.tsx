import { getProductByHandle, getCollectionByHandle } from "@/lib/shopify";
import Container from "@/components/ui/Container";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";
import Image from "next/image";

type Props = {
  params: Promise<{ handle: string }>;
};

const RELATED_COUNT = 4;

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;

  const data = await getProductByHandle(handle);
  const product = data?.product;

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const collectionHandle = product.collections?.edges?.[0]?.node?.handle;
  let relatedProducts: { node: { id: string; title: string; handle: string; descriptionHtml: string; tags: string[]; priceRange: { minVariantPrice: { amount: string; currencyCode: string } }; images: { edges: { node: { url: string; altText: string | null; width: number; height: number } }[] } } }[] = [];
  if (collectionHandle) {
    const collectionData = await getCollectionByHandle(collectionHandle);
    const allInCollection = collectionData?.collection?.products?.edges ?? [];
    relatedProducts = allInCollection
      .filter(({ node }) => node.id !== product.id)
      .slice(0, RELATED_COUNT);
  }

  return (
    <div className="grid md:grid-cols-1">
      <div className="h-[auto] mt-20 md:mt-0 md:h-[85vh] overflow-x-scroll">
        <div className="flex h-full gap-4 snap-x snap-mandatory">
          {product.images.edges.map(({ node }) => (
            <div
              key={node.url}
              className="relative shrink-0 w-full md:w-[min(70vh,600px)] aspect-square md:aspect-square max-h-[85vh] bg-white snap-center flex items-center justify-center"
            >
              <Image
                src={node.url}
                alt={node.altText ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>
      <Container className="px-4 flex flex-col justify-center items-center">
        <div className="h-[10vh] md:h-[15vh] w-full flex md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row md:gap-4 md:flex-1 items-center">
            <h1 className="text-medium">{product.title}</h1>
            <p className="text-medium">
              {parseFloat(
                product.priceRange.minVariantPrice.amount
              ).toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              {product.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>
          {product.customDimensions?.value && (
            <div className="hidden md:block prose text-foreground text-neutral-600">
              <p>{product.customDimensions.value}</p>
            </div>
          )}
          <div className="flex md:flex-1 justify-end">
            {product.variants.edges[0].node.availableForSale ? (
              <AddToCartButton variantId={product.variants.edges[0].node.id} />
            ) : (
              <button
                disabled
                className="bg-red-500 px-4 py-1 text-white"
              >
                SOLD
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-8 align-center">
          <div className="flex flex-col max-w-[500px] text-center gap-8">
            {product.customDimensions?.value && (
              <div className="md:hidden text-foreground text-neutral-600">
                <p>{product.customDimensions.value}</p>
              </div>
            )}
            <div
              className="prose text-foreground text-neutral-600"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
            {product.customCareInstructions?.value && (
              <div className="prose text-foreground text-neutral-600">
                <h2 className="text-base font-medium">Cuidados Básicos</h2>
                {product.customCareInstructions.value
                  .split(".")
                  .filter((sentence) => sentence.trim() !== "")
                  .map((sentence, index) => (
                    <p key={index}>{sentence.trim()}.</p>
                  ))}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-neutral-200">
            <h2 className="text-lg font-medium uppercase tracking-wider text-foreground mb-8 text-center">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
              {relatedProducts.map(({ node }) => (
                <ProductCard key={node.id} product={node} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}