import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import config from "@/app/app.config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cdn.cinergia.lat";

export async function GET(request) {
  try {
    const top = request.nextUrl.searchParams.get("top");
    const limit = top ? parseInt(top) : config.maxLimit;

    const result = await prisma.$queryRaw`
      SELECT 
        m.id, 
        m.name, 
        m.slug, 
        m.releaseYear, 
        m.movieLength AS duration, 
        c.name as category, 
        m.description, 
        m.image1, 
        m.image2, 
        m.ytUrlId 
      FROM movies m
      JOIN categories c ON c.id = m.categoryId
      ORDER BY m.created_at DESC 
      LIMIT ${limit}
    `;

    // Normalizamos las URLs de imágenes
    const resultMap = result.map((movie) => ({
      ...movie,
      image1: normalizeImage(movie.image1, movie.ytUrlId),
      image2: normalizeImage(movie.image2, movie.ytUrlId),
    }));

    return NextResponse.json({ data: resultMap }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * Normaliza la URL de la imagen.
 * Si es una imagen local => la completa con BASE_URL.
 * Si no hay imagen local pero tiene ytUrlId => devuelve miniatura de YouTube.
 */
function normalizeImage(image, ytUrlId) {
  if (image && image.startsWith("http")) return image;
  if (image) return `${BASE_URL}/${image.replace(/^\/+/, "")}`;
  // Imagen por defecto si no hay ninguna
  return `${BASE_URL}/images/movie-default.jpg`;
}
