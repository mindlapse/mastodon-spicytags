import Config from "../../config/Config";
import SampleTagsCommand from "./SampleTagsCommand";
import { spicyTags } from "../../spicyTags.json";
import TagsSvc from "../../svc/TagsSvc";
import SpicyUsersSvc from "../../svc/SpicyUsersSvc";
import RemoteContext from "../../lib/context/RemoteContext";
import MastodonClient from "../../lib/clients/MastodonClient";
import PrismaClient from "../../lib/clients/PrismaClient";
import RedisClient from "../../lib/clients/RedisClient";
import FollowsCache from "../../svc/cache/FollowsCache";

export default async (_: {}, config: Config) => {


  const remotes = new RemoteContext();
  try {
    const mc = new MastodonClient(config.getScanMastodonClientConfig());
    const pc = new PrismaClient(config.getDatabaseUrl());
    const rc = new RedisClient(config.getRedisUrl());
    await remotes.addClient(mc).addClient(pc).addClient(rc).initialise();

    // Load current follows from cache
    const followsCache = new FollowsCache(rc);
    const follows = await followsCache.getFollows();
    console.log(`Loaded ${follows.size} following`);

    // Sample tags & store results
    const tagsSampled = await new SampleTagsCommand({
      mastodonClient: mc,
      onPost: createOnPost(
        follows,
        new TagsSvc(spicyTags, pc),
        new SpicyUsersSvc(pc)
      ),
    }).send();

    // Show timestamped tags for this batch/iteration
    console.log(`${new Date().toISOString()} #${Array.from(tagsSampled)}`);
  } finally {
    await remotes.cleanup();
  }
};

export const createOnPost = (
  follows: Set<string>,
  tagsSvc: TagsSvc,
  spicyUsersSvc: SpicyUsersSvc
) => {
  return async (post: any, postTags: Set<string>) => {
    const user = post.account.acct as string;

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
