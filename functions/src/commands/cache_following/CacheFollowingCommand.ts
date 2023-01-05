import FollowsCache from "../../svc/cache/FollowsCache";
import MastodonClient from "../../lib/clients/MastodonClient";
import RedisClient from "../../lib/clients/RedisClient";
const Mastodon = require("mastodon-api");

export default class CacheFollowingCommand {

  private input: CacheFollowingCommandInput;
  
  constructor(input: CacheFollowingCommandInput) {
    this.input = input
  }
  
  async send() {
    const cache = new FollowsCache(this.input.redisClient);
    const mc = this.input.mastodonClient;
    const accountId = this.input.mastodonAccountId;

    // Load those followed by the given home account
    const follows = await mc.loadAccountsFollowedBy(accountId);

    // Cache results
    console.log(`Caching ${follows.size} follows`)
    await cache.addFollows(...follows);
  }
}


export interface CacheFollowingCommandInput {

  // A Mastodon Account ID to cache follows for
  mastodonAccountId: string;

  mastodonClient: MastodonClient;

  redisClient: RedisClient;
}
