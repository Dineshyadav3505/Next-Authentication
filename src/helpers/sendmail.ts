import User from '@/models/user.model';
import  nodemailer from 'nodemailer';
import bcrypt from "bcryptjs"

export const sendEmail = async ({email, emailType, userId}:any) => {

    try {

        const hashedtoken =  await bcrypt.hash(userId.toString(), 10)

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedtoken,
                    verifyTokenExpires: Date.now() + 3600000, // 1 hour
                })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedtoken,
                    verifyTokenExpires: Date.now() + 3600000, // 1 hour
                })
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
        });
         
        const mailOptions={
            from:'kodingmonk@gmail.com ', // sender address
              to: email, // list of receivers
              subject: emailType === "VERIFY" ? "Verfiy your Email " : "Reset your Password ", // Subject line
              html: `
              <p>Click <a href="${process.env.DOMAIN}/verifyemail?token${hashedtoken}" > Here </a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your Password"}
                or copy and past the link below in your browser.
                <br/>
                ${process.env.DOMAIN}verifyemail?token${hashedtoken}
              </p>`, // html body
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;


    } catch (error:any) {
        throw new Error(error.message);
    }
     
}