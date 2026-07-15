import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const orders = await Order.find({user: session?.user?.id}).populate("user assignedDeliveryMan").sort({createdAt: -1})
        if(!orders) {
            return NextResponse.json({message: "No orders found"}, {status: 404})
        }
        return NextResponse.json(orders, {status: 200})
    } catch(err) {
        return NextResponse.json({message: "Error fetching orders", err}, {status: 500})
    }
}