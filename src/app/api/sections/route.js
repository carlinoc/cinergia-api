import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    const result = await prisma.sections.findMany();
    return NextResponse.json({data: result}, {status: 200});       
}