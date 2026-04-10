import { shopifyFetch } from "./shopify";
import { CART_PREVIEW_IMAGE_ATTR_KEY } from "./cartLineImage";

/* -------------------------------------------------------------------------- */
/*                                 CREATE CART                                */
/* -------------------------------------------------------------------------- */

export async function createCart() {
  return shopifyFetch<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      };
    };
  }>({
    query: `
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
        }
      }
    `,
  });
}

/* -------------------------------------------------------------------------- */
/*                                 ADD TO CART                                */
/* -------------------------------------------------------------------------- */

export async function addToCart(
  cartId: string,
  variantId: string,
  previewImageUrl?: string | null
) {
  const line: {
    merchandiseId: string;
    quantity: number;
    attributes?: { key: string; value: string }[];
  } = {
    merchandiseId: variantId,
    quantity: 1,
  };

  if (previewImageUrl?.trim()) {
    line.attributes = [
      { key: CART_PREVIEW_IMAGE_ATTR_KEY, value: previewImageUrl.trim() },
    ];
  }

  return shopifyFetch({
    query: `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            totalQuantity
          }
        }
      }
    `,
    variables: {
      cartId,
      lines: [line],
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              UPDATE CART LINE                              */
/* -------------------------------------------------------------------------- */

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
) {
  return shopifyFetch({
    query: `
      mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            totalQuantity
          }
        }
      }
    `,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              REMOVE CART LINE                              */
/* -------------------------------------------------------------------------- */

export async function removeCartLine(cartId: string, lineId: string) {
  return shopifyFetch({
    query: `
      mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            totalQuantity
          }
        }
      }
    `,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  GET CART                                  */
/* -------------------------------------------------------------------------- */

export async function getCart(cartId: string) {
  return shopifyFetch<{
    cart: {
      totalQuantity: number;
      checkoutUrl: string;
      lines: {
        edges: {
          node: {
            id: string;
            quantity: number;
            attributes: { key: string; value: string }[];
            merchandise: {
              id: string;
              title: string;
              quantityAvailable: number;
              price: {
                amount: string;
                currencyCode: string;
              };
              product: {
                title: string;
              };
              image?: {
                url: string;
                altText?: string;
              };
            };
          };
        }[];
      };
    };
  }>({
    query: `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          totalQuantity
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    quantityAvailable
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { cartId },
  });
}
