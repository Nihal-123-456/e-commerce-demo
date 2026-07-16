import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb()
        const session = await auth()
        if(session?.user?.role !== "user") {
            return NextResponse.json({message: "You are not a customer"}, {status: 400})
        }

        const { orderId } = await params
        const order = await Order.findById(orderId).populate("assignedDeliveryMan")
        if(!order){
            return NextResponse.json({message: "order not found"}, {status: 404})
        }
        return NextResponse.json(order, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `error while fetching order: ${error}`}, {status: 500})
    }
}