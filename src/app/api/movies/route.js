import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try{
        const result = await prisma.movies.findMany({
            include: {genre_movie: {include: {genres: true}}},
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

// export async function GET() {
//     try{
//         const result = await conn.query('select * from movies')

//         return NextResponse.json(result);
//     }catch (error) {
//         return NextResponse.json(
//             {
//                 message: error.message,
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }