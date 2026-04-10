export type ProductGalleryImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type VariantImageContext = {
  colorSlug: string | null;
  variantImageUrl: string | null;
};

/** Quita sufijo tipo `-1` / `-2` del nombre de archivo (sin extensión). */
function stripTrailingIndexSegment(stem: string): string {
  return stem.replace(/-\d+$/i, "").toLowerCase();
}

/**
 * Slugs con varias partes (ej. azul-datil): el nombre del archivo debe contener
 * cada parte (p. ej. tazadatilazul → azul + datil). Evita mezclar colores que
 * solo comparten "datil".
 */
function stemMatchesMultiPartSlug(stem: string, slug: string): boolean {
  const parts = slug
    .toLowerCase()
    .split("-")
    .map((p) => p.trim())
    .filter((p) => p.length >= 2);
  if (parts.length < 2) return false;
  const h = stem.toLowerCase();
  return parts.every((p) => h.includes(p));
}

/**
 * ¿La URL del asset coincide con el slug del color?
 * Sin `decoded.includes(slug)` suelto: mezclaba fotos que compartían substring.
 */
export function imageUrlMatchesColorSlug(url: string, slug: string): boolean {
  const s = slug.toLowerCase().trim();
  if (!s) return false;

  const decoded = decodeURIComponent(url).toLowerCase();
  const path = decoded.split("?")[0];
  const file = path.split("/").pop() ?? "";
  const stem = file.replace(/\.[a-z0-9]+$/i, "");
  const base = stripTrailingIndexSegment(stem);

  if (base === s) return true;
  if (base.endsWith(`-${s}`)) return true;
  if (base.endsWith(`_${s}`)) return true;

  if (decoded.includes(`/${s}-`) || decoded.includes(`_${s}-`)) return true;
  if (decoded.includes(`/${s}.`) || decoded.includes(`_${s}.`)) return true;

  if (s.includes("-") && stemMatchesMultiPartSlug(stem, s)) return true;

  const compactSlug = s.replace(/[-_]/g, "");
  const compactStem = stem.replace(/[-_]/g, "");
  if (compactSlug.length >= 6 && compactStem.includes(compactSlug)) return true;

  return false;
}

function uniqueByUrl(images: ProductGalleryImage[]): ProductGalleryImage[] {
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  });
}

function variantImageMatchesColor(
  variantImageUrl: string | null,
  colorSlug: string | null
): boolean {
  if (!variantImageUrl || !colorSlug) return false;
  return imageUrlMatchesColorSlug(variantImageUrl, colorSlug);
}

/**
 * Filtra la galería por color. Solo prioriza `variantImageUrl` si también matchea
 * el slug; si no, puede ser la imagen de otra variante en Shopify y ensucia la galería.
 */
export function imagesForVariant(
  images: ProductGalleryImage[],
  variant: VariantImageContext
): ProductGalleryImage[] {
  if (!variant.colorSlug) {
    return images.length > 0 ? images : [];
  }

  const slug = variant.colorSlug;
  const bySlug = images.filter((img) => imageUrlMatchesColorSlug(img.url, slug));

  let ordered = bySlug;

  const variantOk = variantImageMatchesColor(variant.variantImageUrl, slug);

  if (variant.variantImageUrl && variantOk) {
    const fromGallery = images.find((img) => img.url === variant.variantImageUrl);
    if (fromGallery) {
      ordered = uniqueByUrl([
        fromGallery,
        ...bySlug.filter((img) => img.url !== fromGallery.url),
      ]);
    } else {
      ordered = uniqueByUrl([
        {
          url: variant.variantImageUrl,
          altText: null,
          width: 1200,
          height: 800,
        },
        ...bySlug,
      ]);
    }
  }

  if (ordered.length > 0) return ordered;

  if (variant.variantImageUrl) {
    const fromGallery = images.find((img) => img.url === variant.variantImageUrl);
    if (variantOk && fromGallery) return [fromGallery];
    if (variantOk) {
      return [
        {
          url: variant.variantImageUrl,
          altText: null,
          width: 1200,
          height: 800,
        },
      ];
    }
  }

  return images;
}
