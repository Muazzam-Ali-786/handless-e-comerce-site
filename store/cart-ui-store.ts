import { create } from "zustand";

export interface FlyOrigin {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Flight {
  id: number;
  image: string;
  origin: FlyOrigin;
}

interface CartUIState {
  flights: Flight[];
  toastName: string | null;
  toastId: number;
  notice: string | null;
  noticeId: number;
  // Fire the "added to cart" feedback: a flying image clone (when an origin
  // element + image are available) and a short-lived toast with the product name.
  triggerAddFeedback: (name: string, image?: string | null, origin?: FlyOrigin | null) => void;
  // Fire a non-blocking notice (e.g. an out-of-stock message).
  triggerNotice: (text: string) => void;
  removeFlight: (id: number) => void;
  clearToast: (id: number) => void;
  clearNotice: (id: number) => void;
}

export const useCartUIStore = create<CartUIState>((set, get) => ({
  flights: [],
  toastName: null,
  toastId: 0,
  notice: null,
  noticeId: 0,

  triggerAddFeedback: (name, image, origin) => {
    if (image && origin) {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      set((state) => ({ flights: [...state.flights, { id, image, origin }] }));
    }
    const toastId = get().toastId + 1;
    set({ toastName: name, toastId });
  },

  triggerNotice: (text) => {
    const noticeId = get().noticeId + 1;
    set({ notice: text, noticeId });
  },

  removeFlight: (id) =>
    set((state) => ({ flights: state.flights.filter((f) => f.id !== id) })),

  clearToast: (id) =>
    set((state) => (state.toastId === id ? { toastName: null } : state)),

  clearNotice: (id) =>
    set((state) => (state.noticeId === id ? { notice: null } : state)),
}));

// Helper for callers: read an element's viewport rect as a FlyOrigin.
export function rectOf(el: Element | null): FlyOrigin | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}
