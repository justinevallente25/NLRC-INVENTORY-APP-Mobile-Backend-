//utils/sessionStore.js
import crypto from "crypto";

const sessions = new Map();
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const SECRET = process.env.SESSION_SECRET || "nlrc-secret-key";

function encryptToken(raw) {
  return crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
}

// Create session
export function updateSession(username) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const token = encryptToken(rawToken);

  sessions.set(token, {
    username,
    loginTime: Date.now(),
    lastActive: Date.now(),
  });

  console.log(`SESSION CREATED | ${username} | ${token}`);
  return token;
}

// Check session + idle auto-logout
export function checkSession(token) {
  const session = sessions.get(token);
  if (!session) return { valid: false, reason: "not_found" };

  if (Date.now() - session.lastActive > SESSION_TIMEOUT) {
    sessions.delete(token);
    console.log(`SESSION EXPIRED (IDLE) | ${session.username} | ${token}`);
    return {
      valid: false,
      reason: "expired",
      username: session.username,
      token,
    };
  }

  return { valid: true, username: session.username };
}

// Refresh session activity
export function touchSession(token) {
  const session = sessions.get(token);
  if (!session) return false;
  session.lastActive = Date.now();
  return true;
}

// Remove session (logout)
export function removeSession(token) {
  const session = sessions.get(token);
  if (!session) return null;
  sessions.delete(token);
  console.log(`SESSION REMOVED | ${token}`);
  return session;
}
