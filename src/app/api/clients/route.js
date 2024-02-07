import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request) {
    try{
        const email = request.nextUrl.searchParams.get("email")
        
        const result = await prisma.clients.findMany({
            where: {
                email: String(email),
                active: true,
            },
            select: {
                id:true,
                name:true,
                email:true,
                image:true,
                created_at:true,
                client_movie: {
                    select: {
                        id: true,
                        transactionId: true,
                        date_start: true,
                        date_end: true,
                        movies:{
                            select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true}
                        }
                    }
                },
            }
        });

        const resultmap = result.map((res) => ({
            id: res.id,
            name: res.name,
            email: res.email,
            created_at: res.created_at,
            movies: getMovies(res.client_movie)
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
        const id = array[i].movies.id;
        const name = array[i].movies.name;
        const slug = array[i].movies.slug;
        const releaseYear = array[i].movies.releaseYear;
        const image1 = array[i].movies.image1;
        const image2 = array[i].movies.image2;
        const transactionId = array[i].transactionId;
        const date_start = array[i].date_start;
        const date_end = array[i].date_end;

        movies.push({id:id, name:name, slug:slug, releaseYear:releaseYear, image1:image1, image2:image2, transactionId: transactionId, date_start:date_start, date_end:date_end});
    }
    return movies;
}