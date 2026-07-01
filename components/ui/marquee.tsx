"use client";

import { motion } from "framer-motion";

export function Marquee({ text }: { text: string }) {
  return (
    <div className="bg-black text-white py-2 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-10 min-w-full"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
      >
        <div className="flex gap-10 whitespace-nowrap px-4 text-xs tracking-[0.2em] font-semibold uppercase">
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </div>
        <div className="flex gap-10 whitespace-nowrap px-4 text-xs tracking-[0.2em] font-semibold uppercase">
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </motion.div>
    </div>
  );
}
