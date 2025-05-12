"use client"; // Mark this as a Client Component

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import React from "react";

// Define page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    // x: "-50vw", // Example: slide from left
    // scale: 0.9,
  },
  in: {
    opacity: 1,
    // x: 0,
    // scale: 1,
  },
  out: {
    opacity: 0,
    // x: "50vw", // Example: slide to right
    // scale: 0.9,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate", // Softer easing
  duration: 0.6, // Slightly faster duration
};

export default function PageTransitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // Key prop is essential for AnimatePresence to track components
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="overflow-x-hidden" // Prevent horizontal scroll during transitions
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

