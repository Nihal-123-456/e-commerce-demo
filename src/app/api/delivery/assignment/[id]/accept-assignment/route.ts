import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
import emitEventHandler from "@/lib/emitEventHandler";

export async function GET(req:NextRequest, {params}:{params: Promise<{id:string}>}) {
    try {
        await connectDb()
        const {id} = await params
        const session = await auth()
        const deliveryManId = session?.user?.id
        if(!deliveryManId){
            return NextResponse.json({message: "Unauthorized"}, {status: 400})
        }

        const assignment = await DeliveryAssignment.findById(id)
        if(!assignment) {
            return NextResponse.json({message: "Assignment not found"}, {status: 400})
        }
        if(assignment.status !== "broadcasted"){
            return NextResponse.json({message: "Assignment expired"}, {status: 400})
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: deliveryManId,
            status: {$nin: ["broadcasted", "completed"]}
        })
        if(alreadyAssigned){
            return NextResponse.json({message: "This rider is already assigned"}, {status: 400})
        }

        assignment.assignedTo = deliveryManId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        const order = await Order.findById(assignment.order)
        if(!order){
            return NextResponse.json({message: "Order not found"}, {status: 400})
        }
        order.assignedDeliveryMan = deliveryManId
        await order.save()

        await order.populate("assignedDeliveryMan")
        await emitEventHandler("order-assigned", {assignedDeliveryMan: order.assignedDeliveryMan, orderId: order._id})

        await DeliveryAssignment.updateMany(
            {_id: {$ne: assignment._id}, 
            broadcastedTo: deliveryManId,
            status: "broadcasted"
        },
        {
            $pull: {broadcastedTo: deliveryManId}
        })
        return NextResponse.json({message: "Order accepted successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Accept assignment error", error}, {status: 400})
    }
}