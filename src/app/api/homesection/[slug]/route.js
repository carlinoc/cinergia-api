import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, {params}) {
    try{
        const slugId = params.slug;
        
        const result = await prisma.sections.findMany({
            where: {
                slug: String(slugId),
            },
            select: {
                home_section: {
                    select: {
                        id: true,
                        title: true,
                        background: true,
                        home_section_movie: {
                            select: {
                                movies:{
                                    select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true}
                                }
                            }
                        }
                    }
                }
            }
        });

        const resultmap = result.map((res) => ({
            id: res.home_section[0].id,
            name: res.home_section[0].title,
            description: null,
            background: res.home_section[0].background,
            movies: getMovies(res.home_section[0].home_section_movie)
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