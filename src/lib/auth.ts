import crypto from "crypto";

const JWT_SECRET = process.env.JOURNAL_JWT_SECRET || "kws2026-journal-secure-jwt-key-2026";

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return computedHash === hash;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  name?: string;
  exp: number; // unix timestamp in seconds
}

export function generateToken(userId: number, email: string, name?: string): string {
  const payload: AuthTokenPayload = {
    userId,
    email,
    name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days validity
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(payloadB64)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const payload: AuthTokenPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): AuthTokenPayload | null {
  // 1. Check Authorization Header: "Bearer <token>"
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const payload = verifyToken(token);
    if (payload) return payload;
  }

  // 2. Check Cookie: "journal_token=<token>"
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, v.join("=")];
      })
    );
    if (cookies.journal_token) {
      const payload = verifyToken(cookies.journal_token);
      if (payload) return payload;
    }
  }

  return null;
}
