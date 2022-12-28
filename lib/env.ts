// Load the .env.<suffix> file, where the suffix is given by `npm start --env <suffix>`
if (!process.env.npm_config_env) {
  console.log("Missing --env parameter to select the dotenv config by suffix");
  console.log(
    "As an example, you can pass `npm start --env=social` to load ./env/.env.social) "
  );
  process.exit(1);
}
const path = "env/.env." + process.env.npm_config_env;
require("dotenv").config({ path });

if (!process.env.HOME_API_URL || !process.env.SCAN_API_URL) {
  console.log(`Missing ${process.env.npm_config_env}`);
  process.exit(2);
}

// Your Mastodon account ID
export const ACCOUNT_ID = process.env.ACCOUNT_ID!;

// The base URL your home API, needed to load followers
export const HOME_API_URL = process.env.HOME_API_URL!;

// An access token valid for the Mastodon instance at HOME_API_URL
export const HOME_ACCESS_TOKEN = process.env.HOME_ACCESS_TOKEN;

// The base URL for the API to scan - e.g. https://mastodon.social/api/v1/
export const SCAN_API_URL = process.env.SCAN_API_URL!;

// An access token valid for the Mastodon instance at SCAN_API_URL
export const SCAN_ACCESS_TOKEN = process.env.SCAN_ACCESS_TOKEN;

// Time to sleep between fetches
export const SLEEP_MS = parseInt(process.env.SLEEP_MS!);
