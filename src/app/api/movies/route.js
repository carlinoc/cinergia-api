import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import config from '@/app/app.config'

export async function GET(request) {
    try{
        const top = request.nextUrl.searchParams.get("top")
        const limit = top ? top : config.maxLimit
        
        const result = await prisma.$queryRaw`SELECT m.id, m.name, m.slug, m.releaseYear, m.movieLength AS duration, c.name as category, m.description, m.image1, m.image2, m.ytUrlId 
        FROM movies m
        JOIN categories c ON c.id = m.categoryId
        ORDER BY m.created_at DESC LIMIT ${limit}`

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