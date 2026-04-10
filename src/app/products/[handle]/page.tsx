import {
  getProductByHandle,
  getCollectionByHandle,
  getColorMetaobjects,
  getVariantColor,
  toShopifyHandle,
} from "@/lib/shopify";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import {
  ProductVariantGalleryProvider,
  ProductColorGallery,
  ProductCart,
  ProductColorSwatches,
} from "@/components/products/ProductVariantGallery";

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

  const colors = await getColorMetaobjects();
  const variantChoices = product.variants.edges.map(({ node }) => {
    const matched = getVariantColor(node, colors);
    const colorOpt = node.selectedOptions.find(
      (o) => o.name.toLowerCase() === "color",
    );
    const colorSlug = colorOpt?.value ? toShopifyHandle(colorOpt.value) : null;
    return {
      variantId: node.id,
      availableForSale: node.availableForSale,
      label: matched?.label?.trim() || node.title,
      hex: matched?.hex ?? "",
      colorSlug,
      variantImageUrl: node.image?.url ?? null,
    };
  });

  const galleryImages = product.images.edges.map(({ node }) => ({
    url: node.url,
    altText: node.altText,
    width: node.width,
    height: node.height,
  }));

  const collectionHandle = product.collections?.edges?.[0]?.node?.handle;
  let relatedProducts: {
    node: {
      id: string;
      title: string;
      handle: string;
      descriptionHtml: string;
      tags: string[];
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      images: {
        edges: {
          node: {
            url: string;
            altText: string | null;
            width: number;
            height: number;
          };
        }[];
      };
    };
  }[] = [];
  if (collectionHandle) {
    const collectionData = await getCollectionByHandle(collectionHandle);
    const allInCollection = collectionData?.collection?.products?.edges ?? [];
    relatedProducts = allInCollection
      .filter(({ node }) => node.id !== product.id)
      .slice(0, RELATED_COUNT);
  }

  const hasDimensions = !!(
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
    <ProductVariantGalleryProvider
      productTitle={product.title}
      images={galleryImages}
      variants={variantChoices}
    >
      <div className="grid md:grid-cols-1">
        <ProductColorGallery />
        <Container className="flex flex-col justify-center items-center">
          <div className="h-[10vh] md:h-[15vh] w-full flex md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row md:gap-4 md:flex-1 items-center">
              <h1 className="text-medium">{product.title}</h1>
              <p className="text-medium">
                {parseFloat(
                  product.priceRange.minVariantPrice.amount,
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
              <ProductCart />
            </div>
          </div>

          <div className="flex flex-col gap-8 align-center">
            <div className="flex flex-col max-w-[500px] text-center gap-8 justify-center items-center">
              {hasDimensions && (
                <div className="md:hidden flex flex-col text-foreground text-neutral-600">
                  {dimensionLines}
                </div>
              )}
              <ProductColorSwatches />

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
    </ProductVariantGalleryProvider>
  );
}
