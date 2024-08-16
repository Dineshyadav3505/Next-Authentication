import mongoose from "mongoose";

export async function dbconnect():  Promise<void>{
    try {
        // Connect to MongoDB
        console.log(process.env.MONGO_URI)
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;
        
        connection.on('connected', () => {
            console.log("Connected to MongoDB");
        });

        connection.on('error', (error) => {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        });

    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
    }
}