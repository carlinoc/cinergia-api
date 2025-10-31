import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {

    const result = await prisma.movies.findMany({
        where: {
            id: 18,
        },
    })

    return NextResponse.json({data: result}, {status: 200});               
}