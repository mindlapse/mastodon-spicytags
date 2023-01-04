import { createClient } from "redis";

export default class FollowsCache {
    
    private redisURL: string;
    private client?: ReturnType<typeof createClient>;
    private followsKey: string;

    constructor(redisURL: string) {
        this.redisURL = redisURL;
        this.followsKey = this.getKey();
    }


    async connect(): Promise<FollowsCache> {
        const redis = await createClient({ url: this.redisURL })
        redis.on('error', (err) => {
            console.log('Redis Client Error', err)
            redis.disconnect();
        });
        await redis.connect();
        this.client = redis;
        return this;
    }


    getKey() {
        return `${process.env.PRODUCT}:${process.env.ENV}:follows`;
    }
    

    async clearFollows() {
        await this.client?.del(this.followsKey);
    }
    

    async addFollows(...follows: string[]) {
        await this.client?.sAdd(this.followsKey, follows);
    }
    

    async getFollows() {
        return new Set(await this.client?.sMembers(this.followsKey));
    }


    async disconnect() {
        return await this.client?.disconnect();
    }
    
}

