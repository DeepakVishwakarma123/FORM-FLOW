import  express from "express";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config({path:"\.env"})

//express configuration

const app=express()


app.use(express.json({limit:"1000kb"}))
app.use(express.urlencoded(
    {
        extended:true
    }
))

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["get","post","options","put","delete"],
    credentials:true
}))


import formRouter from "./routes/Form-Routes.js";
app.use("/formflow",formRouter)


export default app