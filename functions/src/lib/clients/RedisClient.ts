import { createClient } from 'redis'
import RemoteClient from '../context/RemoteClient'

export type RedisClientType = ReturnType<typeof createClient>

export default class RedisClient extends RemoteClient<RedisClientType> {
    constructor(redisURL: string) {
        super({
            init: async () => {
                const redis = await createClient({ url: redisURL })
                redis.on('error', (err) => {
                    console.log('Redis Client Error', err)
                    redis.disconnect()
                })
                await redis.connect()
                return redis
            },

            cleanUp: async (client: RedisClientType) => {
                await client.disconnect()
            },
        })
    }

    async del(key: string) {
        await this.getClient()?.del(key)
    }

    async sAdd(key: string, ...items: string[]) {
        await this.getClient()?.sAdd(key, items)
    }

    async sMembers(key: string): Promise<Set<string>> {
        return new Set(await this.getClient()?.sMembers(key))
    }

    // Push an item to the front of a list
    async lPush(key: string, ...items: string[]) {
        return await this.getClient()?.lPush(key, items)
    }

    // Trim a list to be at most `maxItems` > 0 in length
    async lTrim(key: string, maxItems: number) {
        return await this.getClient()?.lTrim(key, 0, maxItems - 1)
    }

    // Return a range from a list of indexes [].
    // lastIdx may be -1 to return the entire list
    async lRange(key: string, firstIdx: number, lastIdx: number) {
        return await this.getClient()?.lRange(key, firstIdx, lastIdx)
    }
}
