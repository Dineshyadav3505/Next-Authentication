import { dbconnect } from "@/dbconfig/dbconfig"
import User  from "@/models/user.model"
import { NextResponse, NextRequest} from "next/server"
import bcrypt from "bcryptjs"
import { generateToken } from "@/helpers/";
dbconnect()

export async function POST(request: NextRequest) {
    
    try {
        const { email, password } = await request.json()
        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        return NextResponse.json({
            message: "User authenticated successfully",
            success: true,
            token,
        });
         
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500, });  // Return 500 status code with error message.
    }
}