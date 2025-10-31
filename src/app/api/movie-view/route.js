import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(req) {
  try {
    const { movieId } = await req.json();

    if (!movieId) {
      return NextResponse.json({ error: "movieId requerido" }, { status: 400 });
    }

    const updatedMovie = await prisma.movies.update({
      where: { id: BigInt(movieId) },
      data: {
        views_count: {
          increment: 1,
        },
      },
      select: {
        id: true,
        views_count: true,
      },
    });

    return NextResponse.json({ success: true, views: updatedMovie.views_count });
  } catch (error) {
    console.error("Error incrementando vistas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}