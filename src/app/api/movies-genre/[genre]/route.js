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
                        id:true,
                        movies:{
                            select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true, poster1:true, poster2:true, urlId:true}
                        }
                    },
                    orderBy: {
                        id: 'desc',
                    },
                }
            }
        });

        const resultmap = result.map((res) => ({
            id: res.id,
            name: res.name,
            description: res.description,
            background: null,
            movies: getMovies(res.genre_movie)
        }));
        
        return NextResponse.json({data: resultmap}, {status: 200});       
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

function getMovies(array) {
    const movies = []; 
    for (var i = 0; i < array.length; i++) {
        movies.push(array[i].movies)
    }
    return movies;
}