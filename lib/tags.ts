import { PrismaClient } from "@prisma/client";

export default class Tags {
  private spicyTags: Set<string>;
  private prisma: PrismaClient;

  constructor(spicyTags: string[]) {
    this.spicyTags = new Set(spicyTags);
    this.prisma = new PrismaClient();
  }

  /*
  Get the intersection of the given tags with the spicyTags as an array
  */
  getSpicyTags(tags: NameUrl[]) {
    const found = [];
    for (let tag of tags) {
      let tagName = tag.name.toLowerCase();
      if (this.spicyTags.has(tagName)) {
        found.push(tagName);
      }
    }
    return found;
  }

  async insertTags(tags: Map<string, number>) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.prisma.tagCount.createMany({
      data: Array.from(tags, ([tag, count]) => ({ tag, count, date: today })),
    });
  }
}

interface NameUrl {
  name: string;
  url: string;
}
