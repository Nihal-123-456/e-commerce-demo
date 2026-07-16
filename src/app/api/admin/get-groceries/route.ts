import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if(session?.user?.role !== "admin") {
            return NextResponse.json({message: "You are not an admin"}, {status: 400})
        }
        const groceries = await Grocery.find({})
        return NextResponse.json(groceries, {status: 200})
    } catch(error) {
        return NextResponse.json({message: "Error fetching groceries", error}, {status: 500})
    }
}