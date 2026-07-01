"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransitionVariant } from "@/lib/animations";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageTransitionVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col flex-grow"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
