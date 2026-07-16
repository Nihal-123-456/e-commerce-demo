import Message from "@/models/message.model";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { auth } from "@/auth";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if(!session?.user){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const {roomId} = await req.json()
        const room = await Order.findById(roomId)
        if(!room){
            return NextResponse.json({message: "room not found"}, {status: 400})
        }

        const isParticipant =
            String(room.user) === session.user.id ||
            (room.assignedDeliveryMan && String(room.assignedDeliveryMan) === session.user.id) ||
            session.user.role === "admin"

        if(!isParticipant){
            return NextResponse.json({message: "Forbidden"}, {status: 403})
        }

        const messages = await Message.find({roomId: room._id})

        return NextResponse.json(messages, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Get message error: ${error}`}, {status: 500})
    }
}