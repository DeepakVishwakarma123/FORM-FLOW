import  express from "express";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config({path:"\.env"})

//express configuration

const app=express()


app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded(
    {
        extended:true,
        parameterLimit:1,
    }
))

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["get","post","options","put","delete"],
    credentials:true
}))



export default app