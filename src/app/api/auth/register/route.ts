import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs"

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {name, email, password} = await req.json()
        const userExist = await User.findOne({email})

        if(userExist) {
            return NextResponse.json(
                {message: "User with this email already exist"},
                {status: 400}
            )
        }

        if(password.length < 8) {
            return NextResponse.json(
                {message: "Password must be at least 8 characters"},
                {status: 400}
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password:passwordHash})
        return NextResponse.json(user, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {message: `An error occured while registration - ${error}`},
            {status: 500}
        )
    }
}