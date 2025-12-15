// database/index.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Helper function for logging
function logDBConnection(dbName, err) {
  if (err) {
    console.error(`❌ Failed to connect to ${dbName}:`, err.message);
  } else {
    console.log(`✅ Successfully connected to ${dbName}`);
  }
}

// Main NLRC DB connection
export const mainDB = mysql.createConnection({
  host: process.env.DB_MAIN_HOST,
  user: process.env.DB_MAIN_USER,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_NAME,
});

mainDB.connect((err) => logDBConnection("main_nlrc_db", err));

// Intranet NLRC DB connection
export const intranetDB = mysql.createConnection({
  host: process.env.DB_INTRANET_HOST,
  user: process.env.DB_INTRANET_USER,
  password: process.env.DB_INTRANET_PASSWORD,
  database: process.env.DB_INTRANET_NAME,
});

intranetDB.connect((err) => logDBConnection("db_nlrc_intranet", err));
