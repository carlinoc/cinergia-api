import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, {params}) {
    try{
        let website = request.nextUrl.searchParams.get("website")
        const slugId = params.slug;
        if(website==null) website = "cinergia"

        const web = await prisma.websites.findFirst({
            where: {
                slug: String(website),
            },
            select: {
              id: true
            },
        })
        const websiteId = web.id
                
        const result = await prisma.sections.findMany({
            where: {
                slug: String(slugId),
            },
            select: {
                home_section: {
                    where: {
                        websiteId: String(websiteId)
                    },
                    select: {
                        id: true,
                        title: true,
                        background: true,
                        home_section_movie: {
                            select: {
                                movies:{
                                    select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true, poster1:true, poster2:true, urlId:true}
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
            {data:[], message: error.message},
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