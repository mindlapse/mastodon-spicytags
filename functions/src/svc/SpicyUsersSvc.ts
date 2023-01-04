import { PrismaClient } from "@prisma/client";
import { today } from "../lib/util/date";

export default class SpicyUsersSvc {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /*
  Saves a userId to the database if it is not already present, stamped with the current date.
  Note: The user is not followed
  */
  async save(userId: string) {
    try {
      const savedUser = await this.prisma.spicyUser.findUnique({
        where: {
          user: userId,
        },
      });

      if (!savedUser) {
        await this.prisma.spicyUser.create({
          data: {
            user: userId,
            added_on: today(),
          },
        });
      }
    } catch (e) {
      console.error("Error saving SpicyUser", e);
    }
  }
}
