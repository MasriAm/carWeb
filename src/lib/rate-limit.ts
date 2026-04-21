import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Only create a real Redis client if the Upstash env vars are present.
 * In local/dev environments without Upstash credentials, `Redis.fromEnv()`
 * would still build a client that throws "fetch failed" at call time —
 * we short-circuit to a no-op limiter instead.
 */
function hasUpstashEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

const redis = hasUpstashEnv() ? Redis.fromEnv() : null;

export const authRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "15 m") })
  : null;

export const actionRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 m") })
  : null;

type LimitResult = { success: boolean };

/**
 * Resilient rate-limit check. Fails open (allows the request) when the
 * limiter is unavailable or the Upstash fetch throws — the alternative
 * is a hard "fetch failed" crash on every login attempt.
 */
export async function safeLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<LimitResult> {
  if (!limiter) return { success: true };
  try {
    const res = await limiter.limit(identifier);
    return { success: res.success };
  } catch {
    // Upstash unreachable → don't lock users out of their own app.
    return { success: true };
  }
}

export async function getIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (!forwarded) return "127.0.0.1";
  return forwarded.split(",")[0]?.trim() ?? "127.0.0.1";
}
