import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

// every 14 minutes send a GET request to the health endpoint
// to keep the Render free-tier server from spinning down
const job = new CronJob("*/14 * * * *", function () {
  // RENDER_EXTERNAL_URL is auto-set by Render and points to this service
  const base = process.env.RENDER_EXTERNAL_URL || process.env.CLIENT_URL;
  if (!base) return;
  const url = new URL("/health", base).href;
  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res) => {
      if (res.statusCode === 200) console.log("CR0N: keep-alive ping sent successfully");
      else console.log("CR0N: keep-alive ping failed", res.statusCode);
    })
    .on("error", (e) => console.error("CR0N: Error while sending request", e));
});

// start the cron job immediately
// job.start();

export default job;