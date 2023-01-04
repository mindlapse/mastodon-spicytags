import { PrismaClient } from "@prisma/client";
import { today } from "../lib/util/date";

export default class TagsSvc {
  private spicyTags: Set<string>;
  private prisma: PrismaClient;

  constructor(spicyTags: string[], prisma: PrismaClient) {
    this.spicyTags = new Set(spicyTags);
    this.prisma = prisma;
  }

  /*
  Get the intersection of the given tags with the spicyTags as an array
  */
  extractAllSpicyTags(tags: Set<string>) {
    const found = [];
    for (let tag of tags) {
      let tagLower = tag.toLowerCase();
      if (this.spicyTags.has(tagLower)) {
        found.push(tagLower);
      }
    }
    return found;
  }

  /*
  Persists the user (if needed) to the DB and saves their tags, for the current date.
  */
  async savePostTags(userAddress: string, tags: Set<string>) {
    try {
      const date = today();

      let user = await this.prisma.user.findUnique({
        where: {
          user: userAddress,
        },
      });

      if (!user) {
        // Create the user if they don't already exist
        user = await this.prisma.user.create({
          data: {
            added_on: date,
            user: userAddress,
            tags: {
              createMany: {
                data: Array.from(tags, tag => ({ tag, date })),
              },
            },
          },
        });
      } else {
        // Add tags for the existing user
        await this.prisma.userTag.createMany({
          data: Array.from(tags, tag => ({
            tag,
            userId: user!.id,
            date,
          })),
        });
      }
    } catch (e) {
      console.error("Error saving user tags", e);
    }
  }
}