/** Atributo de línea del carrito Storefront: miniatura elegida en el PDP (por color). */
export const CART_PREVIEW_IMAGE_ATTR_KEY = "_preview_image_url";

export function resolveCartLineImageUrl(item: {
  node: {
    attributes?: { key: string; value: string }[];
    merchandise: { image?: { url?: string | null } | null };
  };
}): string | undefined {
  const fromAttr = item.node.attributes?.find(
    (a) => a.key === CART_PREVIEW_IMAGE_ATTR_KEY
  )?.value;
  const fromVariant = item.node.merchandise?.image?.url ?? undefined;
  return fromAttr?.trim() || fromVariant;
}
