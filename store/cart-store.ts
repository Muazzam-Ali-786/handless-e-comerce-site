import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, Image, Money } from "@/types/shopify";
import { addToCart, createCart, getCart, removeFromCart, updateCart } from "@/app/actions/shopify";
import { useCartUIStore, FlyOrigin } from "@/store/cart-ui-store";

// Display context passed by callers so a local-mode cart can build a line
// without relying on any mock catalog. `origin` (the clicked element's rect)
// and the featured image drive the fly-to-cart feedback.
export interface AddItemContext {
  productId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  price: Money;
  featuredImage: Image;
  selectedOptions?: { name: string; value: string }[];
  origin?: FlyOrigin | null;
}

// A cart line that Shopify refused to stock comes back at quantity 0, often
// with a MERCHANDISE_OUT_OF_STOCK warning. Returns a user-facing message, or null.
const outOfStockMessage = (
  result: { warnings: { code: string; message: string }[]; userErrors: { message: string }[] }
): string | null => {
  const oos = result.warnings?.find((w) => w.code === "MERCHANDISE_OUT_OF_STOCK");
  if (oos) return oos.message;
  if (result.userErrors && result.userErrors.length > 0) return result.userErrors[0].message;
  return null;
};

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  cartId: string | null;
  isLocalMode: boolean;
  localItems: any[];
  setIsOpen: (isOpen: boolean) => void;
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number, context?: AddItemContext) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItemQuantity: (lineId: string, variantId: string, quantity: number) => Promise<void>;
}

// Generate the Shopify-typed Cart structure from local items
const createLocalMockCart = (items: any[]): Cart => {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.amount);
    return sum + (price * item.quantity);
  }, 0);

  const lines = items.map((item, idx) => ({
    node: {
      id: item.lineId,
      quantity: item.quantity,
      cost: {
        totalAmount: {
          amount: (parseFloat(item.price.amount) * item.quantity).toFixed(2),
          currencyCode: item.price.currencyCode
        }
      },
      merchandise: {
        id: item.variantId,
        title: item.variantTitle,
        selectedOptions: item.selectedOptions || [],
        product: {
          id: item.productId,
          handle: item.productHandle,
          title: item.productTitle,
          featuredImage: item.featuredImage
        }
      }
    }
  }));

  const currencyCode = items[0]?.price?.currencyCode || "USD";

  return {
    id: "local-cart",
    checkoutUrl: "/checkout",
    cost: {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode },
      totalAmount: { amount: subtotal.toFixed(2), currencyCode },
      totalTaxAmount: { amount: "0.00", currencyCode }
    },
    lines: {
      edges: lines
    },
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,
      cartId: null,
      isLocalMode: true,
      localItems: [],

      setIsOpen: (isOpen) => set({ isOpen }),

      initializeCart: async () => {
        const { cartId, localItems } = get();
        set({ isLoading: true });
        
        try {
          if (cartId && cartId !== "local-cart") {
            const cart = await getCart(cartId);
            if (cart) {
              set({ cart, isLocalMode: false, isLoading: false });
              return;
            }
          }
          
          // Try to create Shopify cart
          const { cart: newCart } = await createCart();
          set({ cart: newCart, cartId: newCart.id, isLocalMode: false, isLoading: false });
        } catch (error) {
          console.warn("Failed to initialize Shopify cart, falling back to Local Cart:", error);
          const items = localItems || [];
          const cart = createLocalMockCart(items);
          set({ 
            cart, 
            cartId: "local-cart", 
            isLocalMode: true, 
            isLoading: false 
          });
        }
      },

      addItem: async (variantId, quantity, context) => {
        const { cartId, isLocalMode, localItems } = get();
        set({ isLoading: true });

        if (isLocalMode || !cartId || cartId === "local-cart") {
          const items = [...(localItems || [])];
          const existingItemIndex = items.findIndex((item) => item.variantId === variantId);

          if (existingItemIndex > -1) {
            items[existingItemIndex].quantity += quantity;
          } else if (context) {
            // Build the line from the real product data the caller supplied.
            items.push({
              lineId: `local-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              variantId,
              variantTitle: context.variantTitle,
              quantity,
              price: context.price,
              productId: context.productId,
              productHandle: context.productHandle,
              productTitle: context.productTitle,
              featuredImage: context.featuredImage,
              selectedOptions: context.selectedOptions || []
            });
          } else {
            // No context available — add a minimal line keyed by the variant id.
            items.push({
              lineId: `local-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              variantId,
              variantTitle: "",
              quantity,
              price: { amount: "0.00", currencyCode: "USD" },
              productId: variantId,
              productHandle: "",
              productTitle: "Item",
              featuredImage: { url: "", altText: "", width: 0, height: 0 },
              selectedOptions: []
            });
          }

          const cart = createLocalMockCart(items);
          set({
            localItems: items,
            cart,
            cartId: "local-cart",
            isLocalMode: true,
            isLoading: false,
            isOpen: true
          });
          if (context) {
            useCartUIStore.getState().triggerAddFeedback(
              context.productTitle,
              context.featuredImage?.url,
              context.origin
            );
          }
          return;
        }

        try {
          const result = await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
          const oos = outOfStockMessage(result);
          if (oos) {
            // Shopify accepted the request but could not stock the line.
            // Keep the cart closed and surface a clear message instead.
            set({ cart: result.cart, isLoading: false });
            useCartUIStore.getState().triggerNotice(oos);
            return;
          }
          set({ cart: result.cart, isLoading: false, isOpen: true });
          if (context) {
            useCartUIStore.getState().triggerAddFeedback(
              context.productTitle,
              context.featuredImage?.url,
              context.origin
            );
          }
        } catch (error) {
          console.warn("Failed to add to Shopify cart, falling back to local:", error);
          set({ isLocalMode: true, cartId: "local-cart" });
          await get().addItem(variantId, quantity, context);
        }
      },

      removeItem: async (lineId) => {
        const { cartId, isLocalMode, localItems } = get();
        set({ isLoading: true });

        if (isLocalMode || !cartId || cartId === "local-cart") {
          const items = (localItems || []).filter((item) => item.lineId !== lineId);
          const cart = createLocalMockCart(items);
          set({
            localItems: items,
            cart,
            isLoading: false
          });
          return;
        }

        try {
          const { cart } = await removeFromCart(cartId, [lineId]);
          set({ cart, isLoading: false });
        } catch (error) {
          console.warn("Failed to remove from Shopify cart, falling back to local:", error);
          set({ isLocalMode: true, cartId: "local-cart" });
          const currentLines = get().cart?.lines?.edges?.map(e => e.node) || [];
          const items = currentLines
            .filter(line => line.id !== lineId)
            .map(line => ({
              lineId: line.id,
              variantId: line.merchandise.id,
              variantTitle: line.merchandise.title,
              quantity: line.quantity,
              price: line.cost.totalAmount,
              productId: line.merchandise.product.id,
              productHandle: line.merchandise.product.handle,
              productTitle: line.merchandise.product.title,
              featuredImage: line.merchandise.product.featuredImage,
              selectedOptions: line.merchandise.selectedOptions
            }));
          const cart = createLocalMockCart(items);
          set({ localItems: items, cart, isLoading: false });
        }
      },

      updateItemQuantity: async (lineId, variantId, quantity) => {
        const { cartId, isLocalMode, localItems } = get();
        set({ isLoading: true });

        if (isLocalMode || !cartId || cartId === "local-cart") {
          let items = [...(localItems || [])];
          const existingItemIndex = items.findIndex((item) => item.lineId === lineId);

          if (existingItemIndex > -1) {
            if (quantity === 0) {
              items = items.filter((item) => item.lineId !== lineId);
            } else {
              items[existingItemIndex].quantity = quantity;
            }
          }

          const cart = createLocalMockCart(items);
          set({
            localItems: items,
            cart,
            isLoading: false
          });
          return;
        }

        try {
          let result;
          if (quantity === 0) {
            result = await removeFromCart(cartId, [lineId]);
          } else {
            result = await updateCart(cartId, [{ id: lineId, merchandiseId: variantId, quantity }]);
          }
          const oos = outOfStockMessage(result);
          set({ cart: result.cart, isLoading: false });
          if (oos) {
            useCartUIStore.getState().triggerNotice(oos);
          }
        } catch (error) {
          console.warn("Failed to update cart quantity, falling back to local:", error);
          set({ isLocalMode: true, cartId: "local-cart" });
          let items = [...(localItems || [])];
          const existingItemIndex = items.findIndex((item) => item.lineId === lineId);
          if (existingItemIndex > -1) {
            if (quantity === 0) {
              items = items.filter((item) => item.lineId !== lineId);
            } else {
              items[existingItemIndex].quantity = quantity;
            }
          }
          const cart = createLocalMockCart(items);
          set({ localItems: items, cart, isLoading: false });
        }
      },
    }),
    {
      name: "shopify-cart-storage",
      partialize: (state) => ({ 
        cartId: state.cartId,
        isLocalMode: state.isLocalMode,
        localItems: state.localItems
      }),
    }
  )
);

