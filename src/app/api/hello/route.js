import { NextResponse } from "next/server";
import {conn} from '@/libs/mysql'

export async function GET() {
    const result = await conn.query('select now()')
    console.log(result)
    return NextResponse.json({message: "Hello World"});
}