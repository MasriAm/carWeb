"use client";

import { MotionConfig } from "framer-motion";

/**
 * `reducedMotion="user"` makes every Framer Motion animation in the tree
 * honour the operating-system setting: transforms are dropped and only
 * opacity changes remain. The CSS side of the same rule lives in
 * globals.css.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
