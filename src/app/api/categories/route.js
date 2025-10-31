import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try{
        const result = await prisma.categories.findMany();
        return NextResponse.json({data: result}, {status: 200});       
    }catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}