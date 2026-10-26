import { ShopifyFetchParams, Product, Collection, Cart, Connection, CartMutationResult, CartWarning, CartUserError } from "@/types/shopify";
import { getProductQuery, getProductsQuery, getCollectionProductsQuery, getCollectionsQuery, getCartQuery, getCustomerQuery } from "./queries";
import { createCartMutation, addToCartMutation, removeFromCartMutation, updateCartMutation, customerCreateMutation, customerAccessTokenCreateMutation } from "./mutations";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? process.env.SHOPIFY_STORE_DOMAIN.includes("://")
    ? process.env.SHOPIFY_STORE_DOMAIN
    : `https://${process.env.SHOPIFY_STORE_DOMAIN}`
  : "";

const endpoint = `${domain}/api/2024-01/graphql.json`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

// ==========================================
// API HELPER FUNCTIONS
// ==========================================

export async function shopifyFetch<T>({
  cache = "force-cache",
  query,
  tags,
  variables,
}: ShopifyFetchParams): Promise<{ status: number; body: T } | never> {
  if (!domain || !key || domain.includes("your-store-domain")) {
    throw new Error("Shopify credentials not set");
  }

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    throw {
      error,
      query,
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>) => {
  if (!array || !array.edges) return [];
  return array.edges.map((edge) => edge?.node);
};

export async function getProducts({ query, sortKey, reverse }: { query?: string, sortKey?: string, reverse?: boolean } = {}): Promise<Product[]> {
  try {
    const res = await shopifyFetch<{ data: { products: Connection<Product> } }>({
      query: getProductsQuery,
      variables: { query, sortKey, reverse },
      tags: ["products"],
      cache: "no-store"
    });
    return removeEdgesAndNodes(res.body.data.products);
  } catch (error) {
    console.warn("Failed to get products from Shopify.");
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const res = await shopifyFetch<{ data: { product: Product } }>({
      query: getProductQuery,
      variables: { handle },
      tags: ["products"],
      cache: "no-store"
    });
    return res.body.data.product || undefined;
  } catch (error) {
    console.warn(`Failed to get product ${handle} from Shopify.`);
    return undefined;
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await shopifyFetch<{ data: { collections: Connection<Collection> } }>({
      query: getCollectionsQuery,
      tags: ["collections"],
      cache: "no-store"
    });
    return removeEdgesAndNodes(res.body.data.collections);
  } catch (error) {
    console.warn("Failed to get collections from Shopify.");
    return [];
  }
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  try {
    const res = await shopifyFetch<{ data: { collection: { products: Connection<Product> } } }>({
      query: getCollectionProductsQuery,
      variables: { handle },
      tags: ["collections", "products"],
      cache: "no-store"
    });
    if (!res.body.data.collection) {
      return [];
    }
    return removeEdgesAndNodes(res.body.data.collection.products);
  } catch (error) {
    console.warn(`Failed to get collection products for ${handle} from Shopify.`);
    return [];
  }
}

type CartMutationBody = {
  cart: Cart;
  warnings?: CartWarning[] | null;
  userErrors?: CartUserError[] | null;
};

const toCartResult = (payload: CartMutationBody): CartMutationResult => ({
  cart: payload.cart,
  warnings: payload.warnings ?? [],
  userErrors: payload.userErrors ?? [],
});

export async function createCart(): Promise<CartMutationResult> {
  const res = await shopifyFetch<{ data: { cartCreate: CartMutationBody } }>({
    query: createCartMutation,
    cache: "no-store",
  });
  return toCartResult(res.body.data.cartCreate);
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<CartMutationResult> {
  const res = await shopifyFetch<{ data: { cartLinesAdd: CartMutationBody } }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return toCartResult(res.body.data.cartLinesAdd);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<CartMutationResult> {
  const res = await shopifyFetch<{ data: { cartLinesRemove: CartMutationBody } }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return toCartResult(res.body.data.cartLinesRemove);
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<CartMutationResult> {
  const res = await shopifyFetch<{ data: { cartLinesUpdate: CartMutationBody } }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return toCartResult(res.body.data.cartLinesUpdate);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  try {
    const res = await shopifyFetch<{ data: { cart: Cart } }>({
      query: getCartQuery,
      variables: { cartId },
      cache: "no-store",
    });
    return res.body.data.cart;
  } catch (error) {
    console.warn("Failed to get cart.");
    return undefined;
  }
}

export async function createCustomer(input: any) {
  const res = await shopifyFetch<{
    data: {
      customerCreate: {
        customer: any;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    };
  }>({
    query: customerCreateMutation,
    variables: { input },
    cache: "no-store",
  });
  return res.body.data.customerCreate;
}

export async function createCustomerAccessToken(input: any) {
  const res = await shopifyFetch<{
    data: {
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    };
  }>({
    query: customerAccessTokenCreateMutation,
    variables: { input },
    cache: "no-store",
  });
  return res.body.data.customerAccessTokenCreate;
}

export async function getCustomer(customerAccessToken: string) {
  const res = await shopifyFetch<{
    data: {
      customer: any;
    };
  }>({
    query: getCustomerQuery,
    variables: { customerAccessToken },
    cache: "no-store",
  });
  return res.body.data.customer;
}
