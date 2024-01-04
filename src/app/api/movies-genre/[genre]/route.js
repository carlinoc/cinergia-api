import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import config from '@/app/app.config'

export async function GET(request, {params}) {
    try{
        const top = request.nextUrl.searchParams.get("top")
        const limit = top ? top : config.maxLimit
        const genre = params.genre
        
        const result = await prisma.$queryRaw`SELECT m.id, m.name, m.slug, m.releaseYear, m.image1, m.image2 FROM movies m
        JOIN genre_movie gm ON m.id = gm.movie_id
        JOIN genres g ON gm.genre_id = g.id
        WHERE g.slug = ${genre} ORDER BY m.created_at DESC Limit ${limit}`
        
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