import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({path:'\.env'})

async function connectDb() {
    try {
        await mongoose.connect(process.env.mongouri)
        return "connection successful"
    } catch (error) {
        console.log(error);
        
        return Promise.reject("database connection failed")
    }
    
}

export default connectDb;