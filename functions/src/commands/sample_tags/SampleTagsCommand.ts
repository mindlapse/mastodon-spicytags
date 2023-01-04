
const Mastodon = require("mastodon-api");

export interface SampleTagsCommandInput {
  mastodonAPI: string
  mastodonAPIKey: string

  onPost: (user: string, postTags: Set<string>) => void,
}

/**
 * Samples a set of posts from Mastodon and invokes
 * a callback with the user and tags of each post.
 * 
 * A Set<string> of all sampled tags is returned.
 */
export default class SampleTagsCommand {
  private input: SampleTagsCommandInput;

  constructor(input: SampleTagsCommandInput) {
    this.input = input;
  }

  public async send(): Promise<Set<string>> {

    // Scan Mastodon for posts
    const result = await new Mastodon({
      api_url: this.input.mastodonAPI,
      access_token: this.input.mastodonAPIKey,
    }).get("timelines/public", {});

    const tagsSampled = new Set<string>();

    // Loop over each post
    for (let post of result.data) {
      const user = post.account.acct as string;
      const postTags = new Set<string>();

      // Collect tags from the post
      post.tags.forEach((t: any) => postTags.add(t.name));
      postTags.forEach((tag) => tagsSampled.add(tag));

      // Pass the tags to the callback
      await this.input.onPost(user, postTags);
    }
    return tagsSampled;
  }
}
