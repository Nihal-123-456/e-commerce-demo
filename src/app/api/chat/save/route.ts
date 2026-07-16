import Order from "@/models/order.model";
import Message from "@/models/message.model";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { isInternalRequestAuthorized } from "@/lib/verifyInternalRequest";

export async function POST(req:NextRequest) {
    if (!isInternalRequestAuthorized(req)) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }
    try {
        await connectDb()
        const {senderId, text, roomId, time} = await req.json()
        const room = await Order.findById(roomId)
        if(!room){
            return NextResponse.json({message: "room not found"}, {status: 400})
        }
        const message = await Message.create({
            senderId, text, roomId, time
        })

        return NextResponse.json(message, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Create message error: ${error}`}, {status: 500})
    }
}