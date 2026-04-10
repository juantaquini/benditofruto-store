/**
 * Shopify metaobject field `color` puede venir como hex directo (#RGB/#RRGGBB)
 * o, en algunos setups, como JSON con una propiedad anidada.
 */
export function hexFromMetaobjectColorField(
  raw: string | null | undefined
): string {
  if (raw == null || raw === "") return "";
  const trimmed = raw.trim();
  if (/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (typeof parsed === "string") {
        return hexFromMetaobjectColorField(parsed);
      }
      if (
        parsed &&
        typeof parsed === "object" &&
        "color" in parsed &&
        typeof (parsed as { color: unknown }).color === "string"
      ) {
        return hexFromMetaobjectColorField(
          (parsed as { color: string }).color
        );
      }
    } catch {
      return "";
    }
  }
  return "";
}
