import RedisClient from '../../lib/clients/RedisClient'

export default class RecentPostsCache {
    private key: string
    private rc: RedisClient
    private static MAX_ITEMS = 444

    constructor(rc: RedisClient) {
        this.rc = rc
        this.key = this.getKey()
    }

    async addRecentPostIds(...postIds: string[]) {
        if (postIds.length > 0) {
            await this.rc.lPush(this.key, ...postIds)
            await this.rc.lTrim(this.key, RecentPostsCache.MAX_ITEMS)
        }
    }

    async getRecentPostIds(): Promise<Set<string>> {
        return new Set(await this.rc.lRange(this.key, 0, -1))
    }

    private getKey() {
        return `${process.env.PRODUCT}:${process.env.ENV}:recent_posts`
    }
}
