"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, AlertTriangle } from "lucide-react";
import { useCartUIStore } from "@/store/cart-ui-store";

function FlyingImage({
  id,
  image,
  origin,
  onDone,
}: {
  id: number;
  image: string;
  origin: { top: number; left: number; width: number; height: number };
  onDone: (id: number) => void;
}) {
  // Resolve the cart icon position once, at mount.
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = document.querySelector("[data-cart-icon]");
    const r = el?.getBoundingClientRect();
    if (r) setTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    else onDone(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!target) return null;

  return (
    <motion.div
      initial={{
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        opacity: 1,
        borderRadius: 0,
      }}
      animate={{
        top: target.y - 24,
        left: target.x - 24,
        width: 48,
        height: 48,
        opacity: 0.2,
        borderRadius: 999,
      }}
      transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => onDone(id)}
      className="fixed z-[200] overflow-hidden pointer-events-none shadow-xl"
      style={{ position: "fixed" }}
    >
      <Image src={image} alt="" fill sizes="200px" className="object-cover" />
    </motion.div>
  );
}

export function CartFeedback() {
  const { flights, removeFlight, toastName, toastId, clearToast, notice, noticeId, clearNotice } =
    useCartUIStore();
  const reduce = useReducedMotion();

  // Auto-dismiss the toast after 2.5s.
  useEffect(() => {
    if (!toastName) return;
    const id = toastId;
    const t = setTimeout(() => clearToast(id), 2500);
    return () => clearTimeout(t);
  }, [toastName, toastId, clearToast]);

  // Auto-dismiss the notice after 4s (slightly longer — it's an error).
  useEffect(() => {
    if (!notice) return;
    const id = noticeId;
    const t = setTimeout(() => clearNotice(id), 4000);
    return () => clearTimeout(t);
  }, [notice, noticeId, clearNotice]);

  return (
    <>
      {/* Flying image clones (skipped when reduced motion is preferred) */}
      {!reduce && (
        <AnimatePresence>
          {flights.map((f) => (
            <FlyingImage
              key={f.id}
              id={f.id}
              image={f.image}
              origin={f.origin}
              onDone={removeFlight}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toastName && (
          <motion.div
            key={toastId}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[210] flex items-center gap-3 bg-black text-white px-5 py-3 shadow-2xl"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                Added to cart
              </span>
              <span className="text-xs font-medium tracking-wide line-clamp-1 max-w-[220px]">
                {toastName}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Out-of-stock / cart notice */}
      <AnimatePresence>
        {notice && (
          <motion.div
            key={`notice-${noticeId}`}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[210] flex items-center gap-3 bg-white border border-[#1c1917] text-[#1c1917] px-5 py-3 shadow-2xl max-w-[90vw]"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
                Unavailable
              </span>
              <span className="text-xs font-medium tracking-wide line-clamp-2 max-w-[260px]">
                {notice}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
