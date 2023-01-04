import Following from "../../lib/mastodon/following";
import FollowsCache from "../../svc/cache/follows";
const Mastodon = require("mastodon-api");

export default class CacheFollowingCommand {
  private cache!: FollowsCache;
  private following!: Following;
  private input: CacheFollowingCommandInput;

  constructor(input: CacheFollowingCommandInput) {
    this.input = input
  }

  private async setup() {
    this.cache = new FollowsCache(this.input.redisURL);
    const homeInstance = new Mastodon({
      api_url: this.input.mastodonApi,
      access_token: this.input.mastodonApiKey,
    });
    this.following = new Following(homeInstance, this.input.mastodonAccountId);
  }

  async send() {
    await this.setup();
    const follows = await this.loadFollowing();
    console.log(`Caching ${follows.size} follows`)

    await this.cacheFollowing(follows);
  }

  async loadFollowing(): Promise<Set<string>> {
    return await this.following.load();
  }

  async cacheFollowing(follows: Set<string>) {
    try {
      await this.cache.connect();
      await this.cache.addFollows(...follows);
    } finally {
      await this.cache.disconnect();
    }
  }
}


export interface CacheFollowingCommandInput {
  // A Mastodon Account ID who owns the following
  mastodonAccountId: string;

  // Base URL for the Mastodon API of the server that owns `mastodonAccountId`
  mastodonApi: string;

  // API key to access `mastodonApi`
  mastodonApiKey: string;

  // The URL of the Redis instance where the followers will be cached
  redisURL: string;
}
