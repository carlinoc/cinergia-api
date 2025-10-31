import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    const websites = await prisma.websites.findMany();
    return NextResponse.json({data: websites}, {status: 200});       
}