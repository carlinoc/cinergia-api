import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cdn.cinergia.lat";

export async function POST(request) {
    try{
        const {auth_id, name, email, image, countryCode} = await request.json();
        
        const client = await prisma.clients.create({
            data: {
                auth_id: auth_id,
                name: name,
                email: email,
                image: image,
                countryCode: countryCode,
            },
        })

        const id = client.id;
        
        return NextResponse.json({'id':id, 'code': 1}, {status: 200});        
    }catch (error) {
        return NextResponse.json(
            {
                message: error.message,
                code: 0,
            },
            {
                status: 500,
            }
        );
    }
}

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
                auth_id:true,
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
                            select: {id:true, name:true, slug:true, releaseYear:true, image1:true, image2:true, poster1:true, poster2:true, categories:true}
                        }
                    },
                    orderBy: {
                        id: 'desc',
                    },
                },
            }
        });

        const resultmap = result.map((res) => ({
            id: res.id,
            auth_id: res.auth_id,
            name: res.name,
            email: res.email,
            image: res.image,
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

    for (let i = 0; i < array.length; i++) {
        const item = array[i];

        movies.push({
            id: item.movies.id,
            name: item.movies.name,
            slug: item.movies.slug,
            releaseYear: item.movies.releaseYear,
            image1: normalizeImage(item.movies.image1),
            image2: normalizeImage(item.movies.image2),
            poster1: normalizeImage(item.movies.poster1),
            poster2: normalizeImage(item.movies.poster2),
            transactionId: item.transactionId,
            category: item.movies.categories.name,
            date_start: safeDate(item.date_start),
            date_end: safeDate(item.date_end),
        });
    }

    return movies;
}

/**
 * Normaliza una URL de imagen, agregando el CDN si no empieza con http
 */
function normalizeImage(path) {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BASE_URL}/${path}`;
}

function safeDate(d) {
     if (!d || d === 0 || d === "0" || d === "0000-00-00" || d === "0000-00-00 00:00:00") {
        return null;
    }
    const dt = new Date(d);
    if (isNaN(dt.getTime())) {
        return null;
    }
    return dt.toISOString();
}