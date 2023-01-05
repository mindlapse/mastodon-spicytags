import RedisClient from '../../lib/clients/RedisClient'

export default class FollowsCache {
    private followsKey: string
    private rc: RedisClient

    constructor(rc: RedisClient) {
        this.rc = rc
        this.followsKey = this.getKey()
    }

    async clearFollows() {
        await this.rc.del(this.followsKey)
    }

    async addFollows(...follows: string[]) {
        await this.rc.sAdd(this.followsKey, ...follows)
    }

    async getFollows(): Promise<Set<string>> {
        return new Set(await this.rc.sMembers(this.followsKey))
    }

    private getKey() {
        return `${process.env.PRODUCT}:${process.env.ENV}:follows`
    }
}
