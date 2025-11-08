import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, {params}) {
    try{
        const slugId = params.slug;

        const result = await prisma.movies.findMany({
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
                priceUSD: true,
                payment_type: true,
                trailer: true,
                urlId: true,
                releaseYear: true,
                image1: true,
                image2: true,
                poster1: true,
                poster2: true,
                ytUrlId: true,
                created_at: true,
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
                },
                countries:{
                    select: {id:true, name:true}
                },
                categories: true,
              }
        }); 

        const resultmap = result.map((res) => ({
            id: res.id,
            name: res.name,
            slug: res.slug,
            whySee: res.whySee,
            release_year: res.releaseYear,
            description: res.description,
            duration: res.movieLength,
            price: getPrice(res.price),
            priceUSD: getPrice(res.priceUSD),
            payment_type: res.payment_type,
            trailer: res.trailer,
            urlId: res.urlId,
            image1: res.image1,
            image2: res.image2,
            poster1: res.poster1,
            poster2: res.poster2,
            ytUrlId: res.ytUrlId,
            created_at: res.created_at,
            category: res.categories.name,
            languages: [res.languages],
            agerates: [res.agerates],
            director: [res.directors],
            country: [res.countries],
            genres: getGenres(res.genre_movie),
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

function getGenres(array) {
    const genres = []; 
    for (var i = 0; i < array.length; i++) {
        genres.push(array[i].genres.name)
    }
    return genres;
}

function getPrice(price) {
    var _price = parseFloat(price).toFixed(2);
    return _price;
}