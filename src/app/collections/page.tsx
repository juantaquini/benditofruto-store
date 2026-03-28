import { permanentRedirect } from "next/navigation";
import { NEW_IN_COLLECTION_HANDLE } from "@/lib/shopify";

export default function CollectionsPage() {
  permanentRedirect(`/collections/${NEW_IN_COLLECTION_HANDLE}`);
}
