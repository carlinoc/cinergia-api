import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cdn.cinergia.lat"; 
// Usa tu dominio o CDN aquí

export async function GET(request, { params }) {
  try {
    const slugId = params.slug;

    const result = await prisma.movies.findMany({
      where: { slug: String(slugId) },
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
        languages: {
          select: { id: true, name: true },
        },
        agerates: {
          select: { id: true, name: true, range: true },
        },
        directors: {
          select: { id: true, firstName: true, lastName: true },
        },
        genre_movie: {
          select: {
            genres: {
              select: { id: true, name: true },
            },
          },
        },
        countries: {
          select: { id: true, name: true },
        },
        categories: true,
      },
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
      image1: normalizeImage(res.image1),
      image2: normalizeImage(res.image2),
      poster1: normalizeImage(res.poster1),
      poster2: normalizeImage(res.poster2),
      ytUrlId: res.ytUrlId,
      created_at: res.created_at,
      category: res.categories?.name,
      languages: [res.languages],
      agerates: [res.agerates],
      director: [res.directors],
      country: [res.countries],
      genres: getGenres(res.genre_movie),
    }));

    return NextResponse.json({ data: resultmap }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

function getGenres(array) {
  return array.map((item) => item.genres.name);
}

function getPrice(price) {
  const _price = parseFloat(price).toFixed(2);
  return _price;
}

/**
 * Normaliza las rutas de imágenes
 * Si la URL ya empieza con "http", se deja igual (YouTube u otras externas)
 * Si es una ruta local, se le antepone tu dominio BASE_URL
 */
function normalizeImage(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${BASE_URL}/${image.replace(/^\/+/, "")}`;
}
