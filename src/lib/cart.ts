import { shopifyFetch } from "./shopify";

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

export async function addToCart(cartId: string, variantId: string) {
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
      lines: [{ merchandiseId: variantId, quantity: 1 }],
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
