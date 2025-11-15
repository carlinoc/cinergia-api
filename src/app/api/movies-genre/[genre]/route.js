import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import config from '@/app/app.config'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cdn.cinergia.lat";

export async function GET(request, {params}) {
    try{
        const top = request.nextUrl.searchParams.get("top")
        const limit = top ? parseInt(top) : config.maxLimit
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
                            select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true, poster1:true, poster2:true, urlId:true, payment_type:true}
                        }
                    },
                    orderBy: {
                        id: 'desc',
                    },
                    take: limit, // Límite aplicado aquí
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

        console.log(resultmap)
        
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

/**
 * Retorna lista de películas normalizando las URLs de imágenes
 */
function getMovies(array) {
    return array.map((item) => {
        const movie = item.movies;
        
        return {
            ...movie,
            image1: normalizeImage(movie.image1),
            image2: normalizeImage(movie.image2),
            poster1: normalizeImage(movie.poster1),
            poster2: normalizeImage(movie.poster2),
        };
    });
}

/**
 * Normaliza una URL de imagen, agregando el CDN si no empieza con http
 */
function normalizeImage(path) {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BASE_URL}/${path}`;
}