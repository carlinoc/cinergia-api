import { NextResponse } from "next/server";
import {conn} from '@/libs/mysql'
import prisma from "@/libs/prisma";

export async function GET(request, {params}) {
    try{
        const movieId = params.id;
        const result = await prisma.movies.findFirst({
            where: {id: movieId},
            include: {genre_movie: {include: {genres: true}}}

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

// export async function GET(request, {params}) {
//     try{
        
//         const result = await conn.query('SELECT m.id, m.name, m.slug, m.description, m.whySee, m.movieLength, m.releaseYear, m.price, m.trailer, '+
//             'm.urlId, m.image1, m.image2, m.image3, c.name AS category, d.firstName AS director, a.name AS AgeRate  '+ 
//             'FROM movies m JOIN categories c ON m.categoryId = c.id '+
//             'JOIN directors d ON m.directorId = d.id JOIN agerates a ON m.ageRateId = a.id '+
//             'where m.id = ?', [params.id]);

//         if(result == 0) {
//             return NextResponse.json(
//                 {message: "No encontrado"},
//                 {status: 404}
//             );    
//         }

//         return NextResponse.json(result[0]);
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