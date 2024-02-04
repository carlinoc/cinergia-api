import { NextResponse } from "next/server";
import { headers } from 'next/headers'

export async function POST(request) {
    const headersList = headers()
    //const transactionId = 1234568; //headersList.get('TransactionId')
    const transactionId = request.nextUrl.searchParams.get("transactionId")
    const {requestSource, merchantCode, orderNumber, publicKey, amount} = await request.json();

    let body = {
        requestSource: requestSource,
        merchantCode: merchantCode,
        orderNumber: orderNumber,
        publicKey: publicKey,
        amount: amount
    }    

    const res = await fetch('https://sandbox-checkout.izipay.pe/apidemo/v1/Token/Generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'transactionId': transactionId,
        },
        body: JSON.stringify(body),
    })
    
    const data = await res.json()
    return NextResponse.json(data)
}