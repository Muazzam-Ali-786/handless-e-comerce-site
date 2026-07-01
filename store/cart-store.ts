import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart } from "@/types/shopify";
import { addToCart, createCart, getCart, removeFromCart, updateCart } from "@/app/actions/shopify";
import { MOCK_PRODUCTS } from "@/lib/shopify";

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  cartId: string | null;
  isLocalMode: boolean;
  localItems: any[];
  setIsOpen: (isOpen: boolean) => void;
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
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

  return {
    id: "local-cart",
    checkoutUrl: "/checkout",
    cost: {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalTaxAmount: { amount: "0.00", currencyCode: "USD" }
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
          const newCart = await createCart();
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

      addItem: async (variantId, quantity) => {
        const { cartId, isLocalMode, localItems } = get();
        set({ isLoading: true });

        if (isLocalMode || !cartId || cartId === "local-cart") {
          const items = [...(localItems || [])];
          const existingItemIndex = items.findIndex((item) => item.variantId === variantId);

          if (existingItemIndex > -1) {
            items[existingItemIndex].quantity += quantity;
          } else {
            // Look up in premium mock products
            const product = MOCK_PRODUCTS.find((p) =>
              p.variants.edges.some((edge) => edge.node.id === variantId)
            );
            
            if (product) {
              const variant = product.variants.edges.find((edge) => edge.node.id === variantId)?.node;
              if (variant) {
                items.push({
                  lineId: `local-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  variantId,
                  variantTitle: variant.title,
                  quantity,
                  price: variant.price,
                  productId: product.id,
                  productHandle: product.handle,
                  productTitle: product.title,
                  featuredImage: product.featuredImage || { url: "", altText: "", width: 0, height: 0 },
                  selectedOptions: variant.selectedOptions
                });
              }
            } else {
              items.push({
                lineId: `local-line-${Date.now()}`,
                variantId,
                variantTitle: "Default Title",
                quantity,
                price: { amount: "180.00", currencyCode: "USD" },
                productId: "fallback-id",
                productHandle: "fallback",
                productTitle: "Premium Item",
                featuredImage: { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", altText: "Premium Item", width: 800, height: 1000 },
                selectedOptions: []
              });
            }
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
          return;
        }

        try {
          const cart = await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
          set({ cart, isLoading: false, isOpen: true });
        } catch (error) {
          console.warn("Failed to add to Shopify cart, falling back to local:", error);
          set({ isLocalMode: true, cartId: "local-cart" });
          await get().addItem(variantId, quantity);
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
          const cart = await removeFromCart(cartId, [lineId]);
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
          let cart;
          if (quantity === 0) {
            cart = await removeFromCart(cartId, [lineId]);
          } else {
            cart = await updateCart(cartId, [{ id: lineId, merchandiseId: variantId, quantity }]);
          }
          set({ cart, isLoading: false });
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

