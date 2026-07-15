import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs"

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const body = await req.json()
        const name = typeof body?.name === "string" ? body.name.trim() : ""
        const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
        const password = typeof body?.password === "string" ? body.password : ""

        if (!name || !email || !password) {
            return NextResponse.json(
                {message: "Name, email, and password are required"},
                {status: 400}
            )
        }

        const normalizedEmail = email.trim().toLowerCase()
        const userExist = await User.findOne({
            email: { $regex: `^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        })

        if(userExist) {
            return NextResponse.json(
                {message: "User with this email already exists"},
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

        const user = await User.create({name, email: normalizedEmail, password:passwordHash})
        return NextResponse.json(user, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {message: `An error occured while registration - ${error}`},
            {status: 500}
        )
    }
}