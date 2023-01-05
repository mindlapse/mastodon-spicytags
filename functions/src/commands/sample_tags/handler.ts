import Config from '../../config/Config'
import SampleTagsCommand from './SampleTagsCommand'
import { spicyTags } from '../../spicyTags.json'
import TagsSvc from '../../svc/TagsSvc'
import SpicyUsersSvc from '../../svc/SpicyUsersSvc'
import RemoteContext from '../../lib/context/RemoteContext'
import MastodonClient from '../../lib/clients/MastodonClient'
import PrismaClient from '../../lib/clients/PrismaClient'
import RedisClient from '../../lib/clients/RedisClient'
import FollowsCache from '../../svc/cache/FollowsCache'
import RecentPostsCache from '../../svc/cache/RecentPostsCache'

export default async (_: {}, config: Config) => {
    const remotes = new RemoteContext()
    try {
        const mc = new MastodonClient(config.getScanMastodonClientConfig())
        const pc = new PrismaClient(config.getDatabaseUrl())
        const rc = new RedisClient(config.getRedisUrl())
        await remotes.addClient(mc).addClient(pc).addClient(rc).initialise()

        // Load current follows from cache
        const follows = await new FollowsCache(rc).getFollows()
        console.log(`Loaded ${follows.size} following`)

        // Load recent post IDs from cache
        const postCache = new RecentPostsCache(rc)
        const oldPostIds = await postCache.getRecentPostIds()
        const newPostIds = new Set<string>()

        // Sample tags & store results
        const tagsSampled = await new SampleTagsCommand({
            mastodonClient: mc,
            onPost: createOnPost(
                follows,
                oldPostIds,
                newPostIds,
                new TagsSvc(spicyTags, pc),
                new SpicyUsersSvc(pc)
            ),
        }).send()

        // Update cache with new posts
        await postCache.addRecentPostIds(...newPostIds)

        // Show timestamped tags for this batch/iteration
        console.log(`${new Date().toISOString()} #${Array.from(tagsSampled)}`)
    } finally {
        await remotes.cleanup()
    }
}

export const createOnPost = (
    follows: Set<string>,
    oldPostIds: Set<string>,
    newPostIds: Set<string>,
    tagsSvc: TagsSvc,
    spicyUsersSvc: SpicyUsersSvc
) => {
    return async (post: any, postTags: Set<string>) => {
        const user = post.account.acct as string

        // Ignore posts that were already seen & remember new posts
        if (oldPostIds.has(post.id)) return
        newPostIds.add(post.id)

        // Extract spicy tags. If one is found, then store the user.
        const spicy = tagsSvc.extractAllSpicyTags(postTags)
        if (spicy && spicy.length !== 0 && !follows.has(user)) {
            await spicyUsersSvc.save(user)
            console.log(`Saved SpicyUser: ${user} #${spicy}`)
        }

        // Save the tags from the post
        await tagsSvc.savePostTags(user, postTags)
    }
}
