const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;

// Server: use private token (SHOPIFY_STOREFRONT_TOKEN). Client: use public token (NEXT_PUBLIC_).
// See Shopify Headless > Storefront API: "Public" for client-side, "Private" for server-side.
const token =
  typeof window === "undefined"
    ? process.env.SHOPIFY_STOREFRONT_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!
    : process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

const endpoint = `https://${domain}/api/2025-01/graphql.json`;

/* -------------------------------------------------------------------------- */
/*                                   FETCH                                    */
/* -------------------------------------------------------------------------- */

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Shopify fetch failed");
  }

  const json = await res.json();
  return json.data;
}

/* -------------------------------------------------------------------------- */
/*                                GET PRODUCTS                                */
/* -------------------------------------------------------------------------- */

export async function getProducts() {
  return shopifyFetch<{
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          handle: string;
          descriptionHtml: string;
          tags: string[];
          priceRange: {
            minVariantPrice: {
              amount: string;
              currencyCode: string;
            };
          };
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
      }[];
    };
  }>({
    query: `
      query Products {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    `,
  });
}

/* -------------------------------------------------------------------------- */
/*                           GET PRODUCT BY HANDLE                             */
/* -------------------------------------------------------------------------- */

export async function getProductByHandle(handle: string) {
  console.log("🟡 getProductByHandle CALLED");
  console.log("➡️ handle recibido:", handle);

  const data = await shopifyFetch<{
    product: {
      id: string;
      title: string;
      handle: string;
      descriptionHtml: string;
      tags: string[];
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
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
      variants: {
        edges: {
          node: {
            id: string;
            title: string;
            availableForSale: boolean;
            quantityAvailable: number;
          };
        }[];
      };
      customWidth: { value: string } | null;
      customHeight: { value: string } | null;
      customDiameter: { value: string } | null;
      customCapacity: { value: string } | null;
      customCareInstructions: { value: string } | null;
      collections: {
        edges: { node: { handle: string } }[];
      };
    } | null;
  }>({
    query: `
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          descriptionHtml
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
              }
            }
          }
          customWidth: metafield(namespace: "custom", key: "width") {
            value
          }
          customHeight: metafield(namespace: "custom", key: "height") {
            value
          }
          customDiameter: metafield(namespace: "custom", key: "diameter") {
            value
          }
          customCapacity: metafield(namespace: "custom", key: "capacity") {
            value
          }
          customCareInstructions: metafield(namespace: "custom", key: "care_instructions") {
            value
          }
          collections(first: 1) {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    `,
    variables: { handle },
  });

  console.log("📦 respuesta cruda de Shopify:", data);
  console.log("📦 product:", data?.product);

  if (!data?.product) {
    console.warn("❌ PRODUCT NULL para handle:", handle);
  } else {
    console.log("✅ PRODUCT OK:", data.product.title);
  }

  return data;
}


/* -------------------------------------------------------------------------- */
/*                               GET COLLECTIONS                              */
/* -------------------------------------------------------------------------- */

export async function getCollections() {
  const data = await shopifyFetch<{
    collections: {
      edges: {
        node: {
          id: string;
          title: string;
          handle: string;
          descriptionHtml: string;
          products: {
            edges: { node: { id: string } }[];
          };
        };
      }[];
    };
  }>({
    query: `
      query Collections {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              products(first: 1, filters: [{ available: true }]) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `,
  });

  const edges = (data.collections?.edges ?? []).filter(
    ({ node }) => node.products.edges.length > 0
  );

  return {
    collections: {
      edges: edges.map(({ node }) => ({
        node: {
          id: node.id,
          title: node.title,
          handle: node.handle,
          descriptionHtml: node.descriptionHtml,
        },
      })),
    },
  };
}


/* -------------------------------------------------------------------------- */
/*                           GET COLLECTION BY HANDLE                          */
/* -------------------------------------------------------------------------- */

export async function getCollectionByHandle(handle: string) {
  return shopifyFetch<{
    collection: {
      title: string;
      descriptionHtml: string;
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            handle: string;
            descriptionHtml: string;
            tags: string[];
            priceRange: {
              minVariantPrice: {
                amount: string;
                currencyCode: string;
              };
            };
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
        }[];
      };
    };
  }>({
    query: `
      query Collection($handle: String!) {
        collection(handle: $handle) {
          title
          descriptionHtml
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                descriptionHtml
                tags
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { handle },
  });
}