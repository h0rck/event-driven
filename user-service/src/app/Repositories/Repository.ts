import { PrismaClient } from '@prisma/client';

export abstract class Repository {
    protected prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }
}
