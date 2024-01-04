import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, {params}) {
    try{
        const slugId = params.slug;

        const result = await prisma.movies.findFirst({
            where: {
                slug: String(slugId),
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                whySee: true,
                movieLength: true,
                price: true,
                trailer: true,
                urlId: true,
                image1: true,
                image2: true,
                languages:{
                    select: {id:true, name:true}    
                },
                agerates: {
                    select: {id:true, name:true, range: true}
                },
                directors: {
                    select: {id:true, firstName:true, lastName: true},
                },
                genre_movie: {
                    select: {
                        genres: {
                            select: {id:true, name:true}
                        }
                    },    
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