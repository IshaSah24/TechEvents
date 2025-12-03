import { User } from "@/app/database";
import { connectToDatabase } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export  async  function  POST (req:NextRequest) {
    try {   
        await connectToDatabase();
        const {email, password} = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }


        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
    
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!JWT_SECRET) {
            return NextResponse.json({ error: "JWT secret is not set" }, { status: 500 });
          }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          return NextResponse.json({ message: "Login successful", token });

    }catch (err : any){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }   
}