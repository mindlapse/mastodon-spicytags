import sleep from "sleep-promise";
import Followers from "./lib/followers";
import Tags from "./lib/tags";
import spicyTags from "./spicyTags.json";
import {
  HOME_API_URL,
  HOME_ACCESS_TOKEN,
  SCAN_API_URL,
  SCAN_ACCESS_TOKEN,
  ACCOUNT_ID,
  SLEEP_MS,
} from "./lib/env";

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

  const homeInstance = new Mastodon({
    api_url: HOME_API_URL,
    access_token: HOME_ACCESS_TOKEN,
  });
  const following = new Followers(homeInstance, ACCOUNT_ID);
  const follows = await following.load();
  console.log(`Loaded ${follows.size} following`);

  const M = new Mastodon({
    api_url: SCAN_API_URL,
    access_token: SCAN_ACCESS_TOKEN,
  });
  const postDedup = new Set();

  do {
    const result = await M.get("timelines/public", {});
    const batchTags = new Set();

    for (let post of result.data) {
      const user = post.account.acct as string;
      const postTags = new Set<string>();

      // Skip if the post was already seen
      if (postDedup.has(post.id)) {
        continue;
      }
      postDedup.add(post.id);

      // Collect tags from the post
      post.tags.forEach((t: any) => postTags.add(t.name));
      postTags.forEach((tag) => batchTags.add(tag));

      // If the post has a spicy tag, log and store the user
      const spicy = tags.getSpicyTags(post.tags);
      if (spicy && spicy.length !== 0) {
        console.log(`\n${user} #${spicy}\n`);

        if (!follows.has(user)) {
          follows.add(user);
          await following.save(user);
        }
      }

      // Save the tags from the post
      await tags.savePostTags(user, postTags);
    }

    // Show timestamped tags for this batch/iteration
    console.log(`${new Date().toISOString()} #${Array.from(batchTags)}`);

    await sleep(SLEEP_MS);
  } while (true);
};

main().catch((e) => console.error(e));
