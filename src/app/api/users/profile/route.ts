import { getDataFromToken } from "@/helpers/jwtToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { dbconnect } from "@/dbconfig/dbconfig";

dbconnect();

export async function GET(request:NextRequest){

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}