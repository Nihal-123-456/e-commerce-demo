import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDb()
        const orders = await Order.find({}).populate("user assignedDeliveryMan").sort({createdAt: -1})
        return NextResponse.json(orders, {status: 200})
    } catch(error) {
        return NextResponse.json({message: "Error fetching orders", error}, {status: 500})
    }
}