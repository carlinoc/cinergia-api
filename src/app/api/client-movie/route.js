import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request) {
    try{
        const {clientId, movieId, transactionId, amount} = await request.json();

        const startDate = new Date();
        const endDate = addHours(new Date(), 72);

        const client_movie = await prisma.client_movie.create({
            data: {
                client_id: clientId,
                movie_id: movieId,
                transactionId: transactionId,
                amount: amount,
                date_start: startDate,
                date_end: endDate
            },
        })

        const id = client_movie.id;
        
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

function addHours(date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
}