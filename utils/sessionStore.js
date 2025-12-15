// utils/sessionStore.js
import { setUAActive } from "./userStatus.js";

export const sessions = {};
export const SESSION_LIMIT_MINUTES = 30; // 30 minutes inactivity

// Check if session is still valid
export const checkSession = (username) => {
  const session = sessions[username];
  if (!session) return false;

  const now = new Date();
  const diffMinutes = (now - session.lastActive) / (1000 * 60);

  if (diffMinutes > SESSION_LIMIT_MINUTES) {
    // Session expired → mark user inactive
    setUAActive(username, 0);
    delete sessions[username];
    return false;
  }

  return true;
};

// Update session on login or activity
export const updateSession = (username) => {
  const now = new Date();

  if (sessions[username]) {
    // Update last active timestamp
    sessions[username].lastActive = now;
  } else {
    // First time login → store loginTime and lastActive
    sessions[username] = { loginTime: now, lastActive: now };
  }

  setUAActive(username, 1); // mark user as active
};

// Remove session and return session info for logging
export const removeSession = (username) => {
  const session = sessions[username];
  delete sessions[username];
  setUAActive(username, 0); // mark user as inactive
  return session; // return session info so we can calculate active time
};
