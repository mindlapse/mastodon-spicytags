import { PrismaClient as PrismaClientOrig } from '@prisma/client'
import RemoteClient, { RemoteClientConfig } from '../context/RemoteClient'

export default class PrismaClient extends RemoteClient<PrismaClientOrig> {
    constructor(databaseUrl: string) {
        super({
            init: async () => {
                process.env.DATABASE_URL = databaseUrl
                return new PrismaClientOrig()
            },
            cleanUp: async (client: PrismaClientOrig) => {
                await client.$disconnect()
            },
        })
    }
}
