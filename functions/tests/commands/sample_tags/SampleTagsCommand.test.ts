import { jest, expect, describe, beforeEach, it } from '@jest/globals'
import SampleTagsCommand from '../../../src/commands/sample_tags/SampleTagsCommand'
import MastodonClient from '../../../src/lib/clients/MastodonClient'

jest.mock('../../../src/lib/clients/MastodonClient')

describe('SampleTagsCommand', () => {
    let stc: SampleTagsCommand
    let timelinesPublic: jest.SpiedFunction<() => Promise<any>>
    let onPost: jest.Mock<(post: any, postTags: Set<string>) => Promise<void>>

    const posts = { data: [{ id: 'a' }, { id: 'b' }] }

    beforeEach(() => {
        const mc = new MastodonClient({ apiKey: 'key', apiUrl: 'url' })
        timelinesPublic = jest
            .spyOn(mc, 'timelinesPublic')
            .mockImplementation(async () => posts)
        onPost = jest.fn()
        stc = new SampleTagsCommand({
            mastodonClient: mc,
            onPost,
        })
    })

    it('Loads posts from the timeline calls handlePost on each', async () => {
        stc['handlePost'] = jest.fn<typeof stc['handlePost']>()
        const result = await stc.send()
        expect(timelinesPublic).toHaveBeenCalledTimes(1)
        expect(stc['handlePost']).toHaveBeenCalledTimes(2)
        expect(result)
    })

    it('Returns tags', async () => {
        stc['handlePost'] = jest.fn<typeof stc['handlePost']>(
            async (post, tagsSampled: Set<string>) => {
                tagsSampled.add('#climate')
                tagsSampled.add('#cleanenergy')
            }
        )
        const result = await stc.send()

        expect(result).toContainEqual('#climate')
        expect(result).toContainEqual('#cleanenergy')
    })

    it('handlePost() calls onPost', async () => {
        const post = { tags: [{ name: 'solar' }, { name: 'climate' }] }
        const tagsSampled = new Set<string>()
        tagsSampled.add('chemistry')
        stc['handlePost'](post, tagsSampled)
        const expected = new Set<string>().add('solar').add('climate')

        expect(onPost.mock.calls[0][0]).toBe(post)
        expect(onPost.mock.calls[0][1]).toEqual(expected)
        expect(tagsSampled.size).toBe(3)
    })
})
