import { jest, expect, describe, beforeEach, it } from '@jest/globals'
import CacheFollowingCommand from '../../../src/commands/cache_following/CacheFollowingCommand'
import FollowsCache from '../../../src/svc/cache/FollowsCache'
import RedisClient from '../../../src/lib/clients/RedisClient'
import MastodonClient from '../../../src/lib/clients/MastodonClient'

jest.mock('../../../src/lib/clients/MastodonClient')
jest.mock('../../../src/lib/clients/RedisClient')
jest.mock('../../../src/svc/cache/FollowsCache')

describe('CacheFollowingCommand', () => {
    let cmd: CacheFollowingCommand
    const accountId = 'accountId'
    let mc: MastodonClient, rc: RedisClient

    beforeEach(() => {
        jest.clearAllMocks()

        mc = new MastodonClient({
            apiKey: 'key',
            apiUrl: 'url',
        })
        rc = new RedisClient('url')
    })

    it('send() loads follows and sends them to the follows cache', async () => {
        const follows = new Set<string>()
        follows.add('xyz')
        follows.add('abc')

        jest.spyOn(
            MastodonClient.prototype,
            'loadAccountsFollowedBy'
        ).mockImplementation(async () => follows)

        cmd = new CacheFollowingCommand({
            mastodonAccountId: accountId,
            mastodonClient: mc,
            redisClient: rc,
        })

        await cmd.send()
        expect(mc.loadAccountsFollowedBy).toHaveBeenCalledWith(accountId)
        expect(FollowsCache.prototype.addFollows).toHaveBeenCalledWith(
            ...follows
        )
    })
})
