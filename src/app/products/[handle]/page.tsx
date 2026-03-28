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

  const hasDimensions =
    !!(
      product.customWidth?.value?.trim() ||
      product.customHeight?.value?.trim() ||
      product.customDiameter?.value?.trim() ||
      product.customCapacity?.value?.trim()
    );

  const dimensionLines = (
    <>
      {product.customWidth?.value?.trim() ? (
        <p>Ancho: {product.customWidth.value}</p>
      ) : null}
      {product.customHeight?.value?.trim() ? (
        <p>Alto: {product.customHeight.value}</p>
      ) : null}
      {product.customDiameter?.value?.trim() ? (
        <p>Diametro: {product.customDiameter.value}</p>
      ) : null}
      {product.customCapacity?.value?.trim() ? (
        <p>Capacidad: {product.customCapacity.value}</p>
      ) : null}
    </>
  );

  return (
    <div className="grid md:grid-cols-1">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-12 2xl:px-24 pt-24 md:mt-0 md:h-[85vh] md:pt-24 md:flex md:flex-col">
        <div className="h-[auto] md:flex-1 md:min-h-0 overflow-x-scroll">
          <div className="flex h-full snap-x snap-mandatory">
            {product.images.edges.map(({ node }) => (
              <div
                key={node.url}
                className="relative shrink-0 w-full md:w-auto h-full snap-center"
              >
                <Image
                  src={node.url}
                  alt={node.altText ?? product.title}
                  width={node.width ?? 1200}
                  height={node.height ?? 800}
                  sizes="100vw"
                  className="h-full w-full md:w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Container className="flex flex-col justify-center items-center">
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
          {hasDimensions && (
            <div className="hidden md:flex md:flex-col md:text-center prose text-foreground text-neutral-600">
              {dimensionLines}
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
            {hasDimensions && (
              <div className="md:hidden flex flex-col text-foreground text-neutral-600">
                {dimensionLines}
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