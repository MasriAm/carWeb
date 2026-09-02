import { z } from "zod";

export const saveSearchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give this search a name")
    .max(60, "Keep the name under 60 characters"),
  /**
   * The listing page's query string. Stored verbatim so re-running a saved
   * search is just a navigation, and the URL encoding stays the single source
   * of truth for filter state.
   */
  query: z
    .string()
    .max(2000, "That search is too long to save")
    .refine((q) => !q.includes("://"), "Invalid search"),
});

export const deleteSavedSearchSchema = z.object({
  id: z.string().cuid("Invalid id"),
});

export type SaveSearchInput = z.infer<typeof saveSearchSchema>;
