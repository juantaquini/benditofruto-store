"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";
import {
  imagesForVariant,
  type ProductGalleryImage,
} from "@/lib/productImages";

export type VariantWithColorMedia = {
  variantId: string;
  availableForSale: boolean;
  label: string;
  hex: string;
  colorSlug: string | null;
  variantImageUrl: string | null;
};

type GalleryContextValue = {
  productTitle: string;
  displayImages: ProductGalleryImage[];
  variants: VariantWithColorMedia[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  selected: VariantWithColorMedia | undefined;
  showSwatches: boolean;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

function useGalleryContext() {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error(
      "Product gallery components must be used within ProductVariantGalleryProvider"
    );
  }
  return ctx;
}

type ProviderProps = {
  children: ReactNode;
  productTitle: string;
  images: ProductGalleryImage[];
  variants: VariantWithColorMedia[];
};

export function ProductVariantGalleryProvider({
  children,
  productTitle,
  images,
  variants,
}: ProviderProps) {
  const initialId = useMemo(() => {
    const firstOk = variants.find((v) => v.availableForSale);
    return firstOk?.variantId ?? variants[0]?.variantId ?? "";
  }, [variants]);

  const [selectedId, setSelectedId] = useState(initialId);

  const selected =
    variants.find((v) => v.variantId === selectedId) ?? variants[0];

  const displayImages = useMemo(() => {
    if (!selected) return images;
    return imagesForVariant(images, {
      colorSlug: selected.colorSlug,
      variantImageUrl: selected.variantImageUrl,
    });
  }, [images, selected]);

  const value = useMemo(
    () => ({
      productTitle,
      displayImages,
      variants,
      selectedId,
      setSelectedId,
      selected,
      showSwatches: variants.length > 1,
    }),
    [
      productTitle,
      displayImages,
      variants,
      selectedId,
      selected,
    ]
  );

  if (variants.length === 0) {
    return null;
  }

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
}

function useIsMobileViewport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false
  );
}

function mobileGalleryRowHeightPx(
  trackWidthPx: number,
  images: ProductGalleryImage[]
): number | null {
  if (trackWidthPx <= 0 || images.length === 0) return null;
  let maxH = 0;
  for (const img of images) {
    const iw = Math.max(img.width ?? 1200, 1);
    const ih = img.height ?? 800;
    maxH = Math.max(maxH, (trackWidthPx * ih) / iw);
  }
  return Math.max(Math.ceil(maxH), 160);
}

export function ProductColorGallery() {
  const { displayImages, productTitle, selectedId } = useGalleryContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const isMobile = useIsMobileViewport();

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setTrackWidth(el.clientWidth);
    });
    ro.observe(el);
    setTrackWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const mobileHeightPx = useMemo(
    () => mobileGalleryRowHeightPx(trackWidth, displayImages),
    [trackWidth, displayImages]
  );

  const mobileRowStyle =
    isMobile && mobileHeightPx != null
      ? { height: mobileHeightPx, minHeight: mobileHeightPx }
      : undefined;

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-12 2xl:px-24 pt-24 md:mt-0 md:h-[85vh] md:pt-24 md:flex md:flex-col">
      <div
        ref={scrollRef}
        className="h-[auto] min-h-[40vh] overflow-y-hidden overflow-x-scroll [-webkit-overflow-scrolling:touch] md:min-h-0 md:flex-1 md:h-full"
      >
        <div
          className="flex snap-x snap-mandatory md:h-full"
          style={mobileRowStyle}
        >
          {displayImages.map((node, index) => (
            <div
              key={`${selectedId}-${node.url}`}
              className="relative flex h-full w-full min-w-full shrink-0 snap-center items-center justify-center md:min-h-0 md:w-auto md:min-w-0"
            >
              <div className="relative h-full w-full md:hidden">
                <Image
                  src={node.url}
                  alt={node.altText ?? productTitle}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-contain object-center"
                />
              </div>
              <Image
                src={node.url}
                alt={node.altText ?? productTitle}
                width={node.width ?? 1200}
                height={node.height ?? 800}
                sizes="100vw"
                loading={index === 0 ? "eager" : "lazy"}
                className="hidden h-full w-full object-contain md:block md:h-full md:w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function ProductColorSwatches() {
  const { showSwatches, variants, selectedId, setSelectedId } = useGalleryContext();

  return (  
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {variants.map((v) => {
        const isSelected = v.variantId === selectedId;
        const swatchBg = v.hex || "#d4d4d4";
        const hex6 =
          v.hex &&
          /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(v.hex);
        const luminance = hex6
          ? (parseInt(hex6[1], 16) * 299 +
              parseInt(hex6[2], 16) * 587 +
              parseInt(hex6[3], 16) * 114) /
            1000
          : 128;
        const lightSwatch = luminance > 220;

        return (
          <button
            key={v.variantId}
            type="button"
            onClick={() => setSelectedId(v.variantId)}
            title={v.label}
            aria-label={v.label}
            aria-pressed={isSelected}
            className={`relative h-5 w-5 shrink-0 cursor-pointer rounded-full ring-1 ring-offset-0 transition-[box-shadow,opacity] ${
              isSelected ? "ring-foreground" : "ring-neutral-300"
            } ${!v.availableForSale ? "opacity-40" : ""}`}
            style={{
              backgroundColor: swatchBg,
              boxShadow: lightSwatch
              ? "inset 0 0 0 1px rgba(0,0,0,0.12)"
              : undefined,
            }}
          />
        );
      })}
      </div>
  );
}

export function ProductCart() {
  const {
    setSelectedId,
    selected,
    displayImages,
  } = useGalleryContext();

  const cartPreviewImageUrl = displayImages[0]?.url ?? null;

  return (
    <div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:gap-4">
      <div className="flex flex-col items-end gap-1">
        {selected?.availableForSale ? (
          <AddToCartButton
            variantId={selected.variantId}
            cartPreviewImageUrl={cartPreviewImageUrl}
          />
        ) : (
          <button
            disabled
            className="bg-red-500 px-4 py-1 text-white"
            type="button"
          >
            SOLD
          </button>
        )}
      </div>
    </div>
  );
}
