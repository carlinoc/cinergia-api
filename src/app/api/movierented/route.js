import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function POST(request) {
    const {movieId, buyerId, transactionId, price} = await request.json();
    const tokenId = generate_token(32);

    const rented = await prisma.movie_rented.create({
        data: {
          movieId: movieId,
          buyerId: buyerId,
          transactionId: transactionId,
          price: price,
          token: tokenId 
        },
    })

    const id = rented.id;
    
    return NextResponse.json({'id':id, 'token':tokenId}, {status: 200});        
}

function generate_token(length){
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}