import { IncomingMessage } from "node:http";
import { MastodonClientConfig } from "../../config/MastodonClientConfig";
import RemoteClient from "../context/RemoteClient";

const Mastodon = require("mastodon-api");

export default class MastodonClient extends RemoteClient<typeof Mastodon> {
  constructor(config: MastodonClientConfig) {
    super({
      init: async () => {
        console.log(`Creating Mastodon Client for ${config.apiUrl}`)
        return new Mastodon({
          api_url: config.apiUrl,
          access_token: config.apiKey,
        });
      },
      cleanUp: async () => {},
    });
  }

  async timelinesPublic() {
    return this.getClient().get("timelines/public", {});
  }

  /*
    Return the user addresses that the account is following
  */
  async loadAccountsFollowedBy(accountId: string) {
    let allFollows: string[] = [];
    let maxId = undefined;
    let result;
    do {
      result = await this.loadAccountsFollowedByBatch(accountId, maxId);
      console.log(`Loading follows ${maxId}`);
      maxId = result.nextId;

      allFollows = allFollows.concat(result.batch);
    } while (maxId);

    return new Set(allFollows);
  }

  private loadAccountsFollowedByBatch = async (
    accountId: string,
    maxId?: number
  ) => {
    if (typeof maxId === "undefined") {
      maxId = Number.MAX_SAFE_INTEGER;
    }
    const response = await this.getClient().get(
      `accounts/${accountId}/following?max_id=${maxId}`
    );
    const nextId = this.getNextMaxId(response.resp);
    const batch = response.data.map((f: any) => f.acct);

    return {
      batch,
      nextId,
    };
  };

  private getNextMaxId = (resp: IncomingMessage) => {
    const link = resp.headers["link"] as string;
    const matches = link?.match(/max_id=([0-9]+)/);
    return matches ? parseInt(matches[1]) : undefined;
  };
}
