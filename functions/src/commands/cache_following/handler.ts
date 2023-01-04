import Config from "../../config";
import CacheFollowingCommand from "./CacheFollowingCommand";

export default async (payload: {}, config: Config) => {
  return await new CacheFollowingCommand({
    mastodonAccountId: config.getAccountId(),
    mastodonApi: config.getHomeApiUrl(),
    mastodonApiKey: config.getHomeApiKey(),
    redisURL: config.getRedisUrl(),
  }).send();
};