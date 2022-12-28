import sleep from "sleep-promise";
import Followers from "./lib/followers";
import Tags from "./lib/tags";
import spicyTags from "./spicyTags.json";
import { HOME_API_URL, HOME_ACCESS_TOKEN, SCAN_API_URL, SCAN_ACCESS_TOKEN, ACCOUNT_ID, SLEEP_MS } from "./lib/env";

const Mastodon = require("mastodon-api");

const tags = new Tags(spicyTags.spicyTags);

const main = async () => {

  /*
    Watch the federated stream for key hashtags.  For each post:
    IF
      - a post contains one of the 'spicy' hashtags
      - and the account is not already followed (or previously logged)
    THEN
      - log the account to console, and show the spicy tags from its post.
    ELSE
      - Show the current tags
  */

  const allTagsSeen = new Set();
  const homeInstance = new Mastodon({ api_url: HOME_API_URL, access_token: HOME_ACCESS_TOKEN });
  const following = new Followers(homeInstance, ACCOUNT_ID);
  const follows = await following.load();
  console.log(`Loaded ${follows.size} following`);

  const M = new Mastodon({ api_url: SCAN_API_URL, access_token: SCAN_ACCESS_TOKEN });
  do {
    
    const result = await M.get("timelines/public", {});
    const newTags = new Set();
    const batchTags = new Set();
    for (let item of result.data) {
      const user = item.account.acct;

      // Skip the user if it is in the follows Set
      if (follows.has(user)) {
        continue;
      }

      // Collect tags from the batch
      item.tags.forEach((t: any) => {
        if (!allTagsSeen.has(t.name)) {
          allTagsSeen.add(t.name);
          newTags.add(t.name);
        }
        batchTags.add(t.name);
      });

      // If the batch has a post with a spicy tag, log the user & spicy tags
      const spicy = tags.getSpicyTags(item.tags);
      if (spicy && spicy.length !== 0) {
        console.log(`\n${user} #${spicy}\n`);
        follows.add(user);
      }
    }

    // Show timestamped tags for this batch/iteration
    console.log(`${new Date().toISOString()} #${Array.from(newTags)}`);
    await sleep(SLEEP_MS);
  } while (true);
};

main().catch((e) => console.error(e));
