"use client";

import { useEffect } from "react";
import { recordRecentlyViewed } from "@/components/home/recently-viewed";

/**
 * Records this listing in the browser's recently-viewed list. Renders
 * nothing; exists only so the detail page itself can stay a server component.
 */
export default function TrackView({
  id,
  title,
  price,
}: {
  id: string;
  title: string;
  price: number;
}) {
  useEffect(() => {
    recordRecentlyViewed({ id, title, price });
  }, [id, title, price]);

  return null;
}
