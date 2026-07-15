import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
import { sendEmail } from "@/lib/mailer";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {orderId, otp} = await req.json()
        if(!orderId || !otp){
            return NextResponse.json({message: "order/otp not found"}, {status: 404})
        }
        const order = await Order.findById(orderId).populate('user')
        if(!order){
            return NextResponse.json({message: "order not found"}, {status: 404})
        }
        
        if(order.deliveryOtp !== otp){
            return NextResponse.json({message: "invalid otp"}, {status: 400})
        }
        order.status = "delivered"
        order.deliveredAt = new Date()
        order.isPaid = true
        order.deliveryOtpVerification = true
        await order.save()
        await emitEventHandler("order-status-update", {orderId: order._id, status: order.status})

        await DeliveryAssignment.updateOne({order: orderId}, {$set: {assignedTo: null, status: "completed"}})
        
        return NextResponse.json({message: "delivery successfully completed"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "delivery verification failed", error}, {status: 500})
    }
}