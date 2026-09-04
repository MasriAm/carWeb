/**
 * Coercing a pasted origin into something `new URL()` accepts.
 *
 * An origin copied out of a browser's address bar arrives without its scheme —
 * "royalcarweb.vercel.app", not "https://royalcarweb.vercel.app" — and every
 * consumer of one of these variables eventually hands it to `new URL()`. That
 * throws `TypeError: Invalid URL`, and the throw names neither the variable it
 * came from nor, in a minified production bundle, the line that did it.
 *
 * The intent behind a bare host is never ambiguous, so add the scheme rather
 * than fail. Runs on the edge: no Node APIs.
 */
export function normalizeOrigin(value: string | undefined | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  // A trailing slash would double up when callers append a path.
  const trimmed = withScheme.replace(/\/+$/, "");

  try {
    new URL(trimmed);
  } catch {
    return null;
  }
  return trimmed;
}
