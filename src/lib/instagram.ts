/**
 * Build the embed URL for an Instagram post or reel.
 *
 * The links people actually paste come from the app's share sheet and carry a
 * tracking query: `https://www.instagram.com/reel/ABC123/?igsh=xyz`. Appending
 * "/embed" to that string, as this used to, produced
 * `.../reel/ABC123/?igsh=xyz/embed` — a URL Instagram answers with a login
 * wall, so the reel silently never appeared.
 *
 * Rebuilding from the shortcode drops the query and pins the host to
 * `www.instagram.com`, which also keeps the iframe inside the `frame-src`
 * allowance in the CSP; a bare `instagram.com` link would be blocked.
 *
 * Returns null for anything that is not a recognisable post or reel, so the
 * caller can render nothing rather than an empty frame.
 */
export function instagramEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (host !== "instagram.com" && !host.endsWith(".instagram.com")) return null;

  const match = url.pathname.match(/\/(reels?|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;

  const kind = match[1] === "reels" ? "reel" : match[1];
  return `https://www.instagram.com/${kind}/${match[2]}/embed`;
}
