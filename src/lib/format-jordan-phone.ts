/**
 * Normalises a Jordanian phone number to international format (962XXXXXXXXX).
 *
 * Handles common dealer input patterns:
 *   07X XXXX XXX  →  9627XXXXXXXX
 *   +962 7X ...   →  9627X...
 *   00962 ...     →  962...
 *   962...        →  962...  (already correct)
 *
 * Returns the cleaned digits-only string, or the original input
 * stripped of non-digits if it doesn't match a Jordanian pattern
 * (to allow international numbers from other countries).
 */
export function formatJordanPhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");

  if (!digits) return "";

  // 07XXXXXXXX → 9627XXXXXXXX (local Jordanian mobile)
  if (/^07\d{8}$/.test(digits)) {
    return `962${digits.slice(1)}`;
  }

  // 009627XXXXXXXX → 9627XXXXXXXX
  if (digits.startsWith("00962")) {
    return digits.slice(2);
  }

  // Already starts with 962 and has correct length
  if (/^962\d{8,9}$/.test(digits)) {
    return digits;
  }

  // Fallback: return digits as-is (might be a non-JO number)
  return digits;
}
