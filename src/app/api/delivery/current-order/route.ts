import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const deliveryManId = session?.user?.id
        
        const activeAssignment = await DeliveryAssignment.findOne({assignedTo: deliveryManId, status: "assigned"}).populate({
            path: "order", populate: {path: "address"}
        }).lean()
        if(!activeAssignment){
            return NextResponse.json({active: false}, {status: 200})
        }
        return NextResponse.json({active: true, assignment: activeAssignment}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Failed to find active assignment"}, {status: 500})
    }
}