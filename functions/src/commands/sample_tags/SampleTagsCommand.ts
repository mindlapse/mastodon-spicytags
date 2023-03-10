import MastodonClient from '../../lib/clients/MastodonClient'

const Mastodon = require('mastodon-api')

export interface SampleTagsCommandInput {
    mastodonClient: MastodonClient
    onPost: (post: any, postTags: Set<string>) => void
}

/**
 * Samples a set of posts from Mastodon and invokes
 * a callback with the user and tags of each post.
 *
 * A Set<string> of all sampled tags is returned.
 */
export default class SampleTagsCommand {
    private input: SampleTagsCommandInput

    constructor(input: SampleTagsCommandInput) {
        this.input = input
    }

    public async send(): Promise<Set<string>> {
        const tagsSampled = new Set<string>()

        // Scan the public timeline
        const result = await this.input.mastodonClient.timelinesPublic()

        // Handle each post
        for (let post of result.data) {
            await this.handlePost(post, tagsSampled)
        }
        return tagsSampled
    }

    private async handlePost(post:any, tagsSampled: Set<string>): Promise<void> {
        const postTags = new Set<string>()

        // Collect tags from the post
        post.tags.forEach((t: any) => postTags.add(t.name))
        postTags.forEach((tag) => tagsSampled.add(tag))

        // Pass the tags to the callback
        await this.input.onPost(post, postTags)
    }
}
