import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cdn.cinergia.lat";

export async function GET(request, { params }) {
  try {
    let website = request.nextUrl.searchParams.get("website");
    const slugId = params.slug;
    if (!website) website = "cinergia";

    const web = await prisma.websites.findFirst({
      where: { slug: String(website) },
      select: { id: true },
    });

    if (!web) {
      return NextResponse.json(
        { data: [], message: "Website not found" },
        { status: 404 }
      );
    }

    const result = await prisma.sections.findMany({
      where: { slug: String(slugId) },
      select: {
        home_section: {
          where: { websiteId: String(web.id) },
          select: {
            id: true,
            title: true,
            background: true,
            home_section_movie: {
              select: {
                movies: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    releaseYear: true,
                    image1: true,
                    image2: true,
                    poster1: true,
                    poster2: true,
                    urlId: true,
                    payment_type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const resultmap = result.map((res) => ({
      id: res.home_section[0]?.id ?? null,
      name: res.home_section[0]?.title ?? "",
      description: null,
      background: normalizeImage(res.home_section[0]?.background),
      movies: getMovies(res.home_section[0]?.home_section_movie || []),
    }));

    return NextResponse.json({ data: resultmap }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { data: [], message: error.message },
      { status: 500 }
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
