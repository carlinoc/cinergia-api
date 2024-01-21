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