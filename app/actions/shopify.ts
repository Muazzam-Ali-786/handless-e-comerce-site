"use server";

import { 
  createCart as shopifyCreateCart, 
  addToCart as shopifyAddToCart, 
  removeFromCart as shopifyRemoveFromCart, 
  updateCart as shopifyUpdateCart, 
  getCart as shopifyGetCart,
  createCustomer as shopifyCreateCustomer,
  createCustomerAccessToken as shopifyCreateCustomerAccessToken,
  getCustomer as shopifyGetCustomer
} from "@/lib/shopify";

export async function createCart() {
  return await shopifyCreateCart();
}

export async function addToCart(cartId: string, lines: any[]) {
  return await shopifyAddToCart(cartId, lines);
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  return await shopifyRemoveFromCart(cartId, lineIds);
}

export async function updateCart(cartId: string, lines: any[]) {
  return await shopifyUpdateCart(cartId, lines);
}

export async function getCart(cartId: string) {
  return await shopifyGetCart(cartId);
}

export async function createCustomer(input: any) {
  try {
    return await shopifyCreateCustomer(input);
  } catch (err: any) {
    const message = err?.message || err?.error?.message || "Failed to communicate with Shopify.";
    return {
      customer: null,
      customerUserErrors: [{ code: "ERROR", field: [], message }]
    };
  }
}

export async function createCustomerAccessToken(input: any) {
  try {
    return await shopifyCreateCustomerAccessToken(input);
  } catch (err: any) {
    const message = err?.message || err?.error?.message || "Failed to communicate with Shopify.";
    return {
      customerAccessToken: null,
      customerUserErrors: [{ code: "ERROR", field: [], message }]
    };
  }
}

export async function getCustomer(accessToken: string) {
  try {
    return await shopifyGetCustomer(accessToken);
  } catch (err: any) {
    console.error("Failed to get customer:", err);
    return null;
  }
}


