import Config from "../../config";
import SampleTagsCommand from "./SampleTagsCommand";
import { spicyTags } from "../../spicyTags.json";
import TagsSvc from "../../svc/TagsSvc";
import { PrismaClient } from "@prisma/client";
import SpicyUsersSvc from "../../svc/SpicyUsersSvc";
import { loadFollows } from "../../svc/FollowsSvc";

export default async (_: {}, config: Config) => {
  // Load current follows from cache
  const follows = await loadFollows(config.getRedisUrl());
  console.log(`Loaded ${follows.size} following`);

  let prisma;
  try {
    // Initialize DB
    process.env.DATABASE_URL = config.getDatabaseUrl();
    prisma = new PrismaClient();

    // Sample tags, storing
    const tagsSampled = await new SampleTagsCommand({
      mastodonAPI: config.getHomeApiUrl(),
      mastodonAPIKey: config.getHomeApiKey(),
      onPost: createOnPost(
        follows,
        new TagsSvc(spicyTags, prisma),
        new SpicyUsersSvc(prisma)
      ),
    }).send();

    // Show timestamped tags for this batch/iteration
    console.log(`${new Date().toISOString()} #${Array.from(tagsSampled)}`);
  } finally {
    await prisma?.$disconnect();
  }
};

export const createOnPost = (
  follows: Set<string>,
  tagsSvc: TagsSvc,
  spicyUsersSvc: SpicyUsersSvc
) => {
  return async (user: string, postTags: Set<string>) => {
    // Extract spicy tags. If one is found, then store the user.
    const spicy = tagsSvc.extractAllSpicyTags(postTags);
    if (spicy && spicy.length !== 0 && !follows.has(user)) {
      await spicyUsersSvc.save(user);
      console.log(`Saved SpicyUser: ${user} #${spicy}`);
    }

    // Save the tags from the post
    await tagsSvc.savePostTags(user, postTags);
  };
};
