import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";
import { today } from "../../lib/util/date";

export default class Following {
  private M: any;
  private accountId: string;
  private prisma: PrismaClient;

  constructor(mastodon: any, accountId: string) {
    this.M = mastodon;
    this.accountId = accountId;
    this.prisma = new PrismaClient();
  }


  /*
    Return the user addresses that the account is following
  */
  async load() {
    let allFollowers: string[] = [];
    let maxId = undefined;
    let result;
    do {
      result = await this.loadFollowingBatch(maxId);
      console.log(`Loading followers ${maxId}`);
      maxId = result.nextId;

      allFollowers = allFollowers.concat(result.batch);
    } while (maxId);

    return new Set(allFollowers);
  }

  
  private loadFollowingBatch = async (maxId?: number) => {
    if (typeof maxId === "undefined") {
      maxId = Number.MAX_SAFE_INTEGER;
    }
    const response = await this.M.get(
      `accounts/${this.accountId}/following?max_id=${maxId}`
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
