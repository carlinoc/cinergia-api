import { PrismaClient } from "@prisma/client";


BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

globalForPrisma.prisma = prisma;

export default prisma;