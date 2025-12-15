//utils/sessionStore.js
import crypto from "crypto";

const sessions = new Map();
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const SECRET = process.env.SESSION_SECRET || "nlrc-secret-key";

// 🔐 create encrypted token
function encryptToken(raw) {
  return crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
}

// ✅ LOGIN → create session
export function updateSession(username) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const token = encryptToken(rawToken);

  sessions.set(token, {
    username,
    loginTime: new Date(),
    lastActive: new Date(),
  });

  console.log(`SESSION CREATED | ${username} | ${token}`);
  return token;
}

// 🔍 CHECK SESSION
export function checkSession(token) {
  const session = sessions.get(token);
  if (!session) return null;

  // expire inactive session
  if (Date.now() - session.lastActive > SESSION_TIMEOUT) {
    sessions.delete(token);
    console.log(`SESSION EXPIRED | ${token}`);
    return null;
  }

  session.lastActive = new Date();
  return session.username;
}

// 🚪 LOGOUT → flush encrypted token
export function removeSession(token) {
  const session = sessions.get(token);
  if (!session) return null;

  sessions.delete(token);
  console.log(`SESSION REMOVED | ${token}`);
  return session;
}
