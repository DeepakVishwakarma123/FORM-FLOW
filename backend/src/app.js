import  express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"
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

app.use(
    cookieParser()
)


import formRouter from "./routes/Form-Routes.js";
import authRouter from "./routes/Auth-routes.js";
import { captchaRouter } from "./routes/Captcha-route.js";
app.use("/formflow",formRouter)
app.use("/auth",authRouter)
app.use("/captcha",captchaRouter)


export default app