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

if (!process.env.API_URL) {
  console.log(`Missing ${process.env.npm_config_env}`);
  process.exit(2);
}

// The base URL for the API - for example: https://mastodon.social/api/v1/
export const API_URL = process.env.API_URL!;

// The Mastodon account ID
export const ACCOUNT_ID = process.env.ACCOUNT_ID!;

// An access token for the above Mastodon account
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Time to sleep between fetches
export const SLEEP_MS = parseInt(process.env.SLEEP_MS!);
