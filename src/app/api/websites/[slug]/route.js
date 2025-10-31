import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, {params}) {
    try{
        const slugId = params.slug;

        const result = await prisma.websites.findMany({
            where: {
                slug: String(slugId),
            },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                logo: true,
                background: true,
                color1: true,
                color2: true,
                color3: true,
                color4: true
            }
        });
        
        const resultmap = result.map((res) => ({
            id: res.id,
            title: res.title,
            slug: res.slug,
            description: res.description,
            logo: res.logo,
            background: res.background,
            color1: res.color1,
            color2: res.color2,
            color3: res.color3,
            color4: res.color4
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