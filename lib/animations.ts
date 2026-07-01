import type { Variants } from "framer-motion";

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1] as [number, number, number, number],
    }
  }
};

export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const pageTransitionVariant: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
  exit: { 
    opacity: 0, 
    filter: "blur(10px)",
    transition: { duration: 0.3, ease: "easeIn" as const }
  }
};

export const imageHoverVariant: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};
