import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import config from '@/app/app.config'

export async function GET(request, {params}) {
    try{
        const top = request.nextUrl.searchParams.get("top")
        const limit = top ? top : config.maxLimit
        const genre = params.genre
        
        const result = await prisma.genres.findMany({
            where: {
                slug: String(genre),
            },
            select: {
                id:true,
                name:true,
                slug:true,
                description: true,
                genre_movie: {
                    select: {
                        movies:{
                            select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true}
                        }
                    }
                }
            }
        });
        
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