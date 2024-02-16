import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request) {
    try{
        const {clientId, movieId, transactionId, amount} = await request.json();

        const currentDate = new Date();
        const row = await prisma.client_movie.count({
            where: {
                client_id: clientId,
                movie_id: movieId,
                date_end: {
                    gt: currentDate
                }
            },
        });
        if(row == 0) {
            const startDate = new Date();
            const endDate = addHours(new Date(), 77);

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
            
            return NextResponse.json({'id':id, 'code': 1, 'message': 'Pelicula agregada'}, {status: 200});        
        }else{
            return NextResponse.json({'id':0, 'code': 2, 'message': 'Ya existe la pelicula y esta activa'}, {status: 200});        
        }
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