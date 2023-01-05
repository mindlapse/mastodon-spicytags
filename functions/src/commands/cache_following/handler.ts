import Config from "../../config/Config";
import MastodonClient from "../../lib/clients/MastodonClient";
import RedisClient from "../../lib/clients/RedisClient";
import RemoteContext from "../../lib/context/RemoteContext";
import CacheFollowingCommand from "./CacheFollowingCommand";

export default async (_: {}, config: Config) => {

  const remotes = new RemoteContext();
  try {
    const mc = new MastodonClient(config.getHomeMastodonClientConfig());
    const rc = new RedisClient(config.getRedisUrl());
    await remotes.addClient(mc).addClient(rc).initialise();

    await new CacheFollowingCommand({
      mastodonAccountId: config.getHomeAccountId(),
      mastodonClient: mc,
      redisClient: rc
    }).send();

  } finally {
    await remotes.cleanup();
  }

};