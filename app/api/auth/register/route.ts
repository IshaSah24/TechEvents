import { User } from "@/app/database";
import { connectToDatabase } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function  POST (req:NextRequest) {
    try {
        await connectToDatabase()
        const {name,  email ,  password} =  await req.json();
        
        if  (!name || !email || !password) {
            return  NextResponse.json({error  : "All fields are required"}, {status : 400});
        }
        const  esistingUser  = await User.findOne({email});
        if  (esistingUser) {
            return NextResponse.json ({error : "email already  registered"}, {status : 400});
        }


        const  user = await User.create({name,  email, password});
        return  NextResponse.json({message : "User registered successfully", userId : user._id});
    }catch(err : any) {
        return NextResponse.json ({error : err.message}, {status:500});
    }
}