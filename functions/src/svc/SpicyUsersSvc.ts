import PrismaClient from "../lib/clients/PrismaClient";
import { today } from "../lib/util/date";

export default class SpicyUsersSvc {
  private pc: PrismaClient;

  constructor(pc: PrismaClient) {
    this.pc = pc;
  }

  /*
  Saves a userId to the database if it is not already present, stamped with the current date.
  Note: The user is not followed
  */
  async save(userId: string) {
    try {
      const prisma = this.pc.getClient()
      const savedUser = await prisma.spicyUser.findUnique({
        where: {
          user: userId,
        },
      });

      if (!savedUser) {
        await prisma.spicyUser.create({
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
