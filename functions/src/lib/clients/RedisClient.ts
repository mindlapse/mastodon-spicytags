import { createClient } from "redis";
import RemoteClient from "../context/RemoteClient";

export type RedisClientType = ReturnType<typeof createClient>;

export default class RedisClient extends RemoteClient<RedisClientType> {
  constructor(redisURL: string) {
    super({
      init: async () => {
        const redis = await createClient({ url: redisURL });
        redis.on("error", (err) => {
          console.log("Redis Client Error", err);
          redis.disconnect();
        });
        await redis.connect();
        return redis;
      },

      cleanUp: async (client: RedisClientType) => {
        await client.disconnect();
      },
    });
  }

  async del(key: string) {
    await this.getClient()?.del(key);
  }

  async sAdd(key: string, ...items: string[]) {
    await this.getClient()?.sAdd(key, items);
  }

  async sMembers(key: string): Promise<Set<string>> {
    return new Set(await this.getClient()?.sMembers(key));
  }

}
