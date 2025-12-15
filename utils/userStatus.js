// utils/userStatus.js
import { mainDB } from "../database/index.js";

/**
 * Set the UAActive status for a user
 * @param {string} username
 * @param {0|1} value
 */
export const setUAActive = (username, value) => {
  mainDB.query(
    "UPDATE m_useraccounts SET UAActive = ? WHERE UAUsername = ?",
    [value, username],
    (err) => {
      if (err) console.error(`Failed to update UAActive for ${username}:`, err);
    }
  );
};
