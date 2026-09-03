/**
 * Single source of truth for the bcrypt work factor.
 *
 * Registration and admin password resets previously used different costs (10
 * and 12), which meant a reset password verified measurably slower than a
 * self-chosen one. Keep them equal.
 */
export const PASSWORD_HASH_ROUNDS = 12;
