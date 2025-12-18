// invserver.js
import express from "express";
import os from "os";
import dotenv from "dotenv";
import { mainDB, intranetDB } from "./database/index.js"; // DB connections
import login from "./apiHandler/Login/login.js"; // Import the login API
import logout from "./apiHandler/Login/logout.js"; // Import the logout Api
import checkSession from "./apiHandler/Login/checkSession.js"; // import your check-session API
import activity from "./apiHandler/Login/activity.js";
import noSerialListRouter from "./apiHandler/scan/noSerialList.js";
import deviceDetailsRouter from "./apiHandler/scan/deviceDetails.js";
import addSerialManualRouter from "./apiHandler/scan/addSerialManual.js";
import saveSerialNumRouter from "./apiHandler/scan/saveSerialNum.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Helpers --- //
function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const result = [];

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        let type = "Unknown";

        if (/wi[-]?fi|wlan/i.test(name)) type = "Wi-Fi";
        else if (/eth|en/i.test(name)) type = "Ethernet";
        else if (/hotspot|hosted|local area connection/i.test(name))
          type = "Hotspot";

        result.push({ name, ip: iface.address, type });
      }
    }
  }

  return result.length
    ? result
    : [{ name: "localhost", ip: "127.0.0.1", type: "Loopback" }];
}

function logNetworkInfo(interfaces, host) {
  console.log("\n🚀 NLRC Backend is running!\n");
  console.log("Available network interfaces:");
  interfaces.forEach((iface, i) => {
    console.log(` ${i + 1}. ${iface.name} - ${iface.ip} (${iface.type})`);
  });
  console.log(`\nServer bound to: http://${host}:${PORT}\n`);
}

// --- Global Logger Middleware --- //
app.use((req, res, next) => {
  req.log = (message) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Use local time in YYYY-MM-DD HH:MM:SS format
    const now = new Date();
    const timestamp = now
      .toLocaleString("en-PH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", ""); // optional: remove comma

    console.log(
      `📌 [${req.method}] ${req.originalUrl} | IP: ${ip} | ${message} | Time: ${timestamp}`
    );
  };
  next();
});

// --- Main --- //
const interfaces = getNetworkInterfaces();
const HOST = interfaces[0].ip;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("🚀 NLRC Backend is running!"));

app.use("/api/login", login);
app.use("/api/check-session", checkSession);
app.use("/api/activity", activity);
app.use("/api/logout", logout);
app.use("/api/scan/noSerialList", noSerialListRouter);
app.use("/api/scan/device", deviceDetailsRouter);
app.use("/api/scan/addSerialManual", addSerialManualRouter);
app.use("/api/scan/saveSerialNum", saveSerialNumRouter);

// Start server
app.listen(PORT, HOST, () => logNetworkInfo(interfaces, HOST));
