import { dbconnect } from "@/dbconfig/dbconfig"
import User  from "@/models/user.model"
import { NextResponse, NextRequest} from "next/server"
import bcrypt from "bcryptjs"
import { sendEmail } from "@/helpers/sendmail"

dbconnect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                username, 
                email, 
                password: hashedPassword, 
            }
        )

        const savedUser = await newUser.save()

        /// send Verfication mail
        await sendEmail({email: savedUser.email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json(
            {
                message:"User registered successfully",
                success: true,
                email: savedUser.email, 
            }
        )

        
    } catch (error:any) {
        return NextResponse.json({ error: error.message },{status: 500,}); 
    }
}