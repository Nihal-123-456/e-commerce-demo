import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import emitEventHandler from "@/lib/emitEventHandler";

interface IDeliveryMenPayload {
    id: string,
    name: string,
    mobile: string,
    latitude: number,
    longitude: number
}

export async function POST(req:NextRequest, {params}:{params: Promise<{orderId:string}>}) {
    try {
        await connectDb()
        const {orderId} = await params
        const {status} = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json({message: "Order not found"}, {status: 404})
        }

        order.status = status
        let deliveryMenPayload:IDeliveryMenPayload[] = []

        if(status === "out for delivery" && !order.assignment){
            const {latitude, longitude} = order.address
            const nearByDeliveryMen = await User.find({
                role: "deliveryMan",
                location: {
                    $near: {
                        $geometry: {type: "Point", coordinates: [Number(longitude), Number(latitude)]},
                        $maxDistance: 10000
                    }
                }
            })

            const nearByIds = nearByDeliveryMen.map((m) => m._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: {$in: nearByIds},
                status: {$nin: ["broadcasted", "completed"]}
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyIds.map(b => String(b)))
            const availableDeliveryMen = nearByDeliveryMen.filter(
                m => !busyIdSet.has(String(m._id))
            )

            const candidates = availableDeliveryMen.map(m=>m._id)
            if(candidates.length === 0) {
                await order.save()
                await emitEventHandler("order-status-update", {orderId: order._id, status: order.status})

                return NextResponse.json({message: "Delivery men not available"}, {status: 200})
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            })
            await deliveryAssignment.populate('order')

            for(const candidateId of candidates){
                const m = await User.findById(candidateId)
                if(m.socketId){
                    await emitEventHandler("new-assignment", deliveryAssignment, m.socketId)
                }
            }

            order.assignment = deliveryAssignment._id
            
            deliveryMenPayload = availableDeliveryMen.map(m => ({
                id: String(m._id), name: String(m.name), 
                mobile: String(m.mobile),
                latitude: Number(m.location.coordinates[1]), 
                longitude: Number(m.location.coordinates[0])
            }))
        }

        await order.save()
        await order.populate('user')
        await emitEventHandler("order-status-update", {orderId: order._id, status: order.status})

        return NextResponse.json({
            assignment: order.assignment?._id,
            availableDeliveryMen: deliveryMenPayload
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Update status error: ${error}`}, {status: 500})
    }
}