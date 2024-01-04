import { NextResponse } from "next/server";

export async function GET() {

    // const result = await prisma.movies.findMany({
        //     include: {
        //         genre_movie: {
        //             include: {genres: true}
        //         }
        //     },
        // });

        // const result = await prisma.movies.findMany({
        //     include: {
        //         genre_movie: {
        //             select: {
        //                 genre_id: true,
        //             },
        //         },
        //     },
        // });

    return NextResponse.json({message: "Hello World1"});
}