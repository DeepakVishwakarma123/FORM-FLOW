import jsonwebtoken from "jsonwebtoken"
import asyncHandler from "../utils/Async-Handler.js"


let authMiddeware=asyncHandler(
    async function (req,res,next) {
        let requestCookies=req.cookies
        let accessToken=requestCookies.access_token
        try {
            let decodedPayload=jsonwebtoken.verify(accessToken,process.env.acc_secret)
            console.log(decodedPayload);
            req.userId=decodedPayload["userId"]
            next()
        } catch (error) {
           res.status(401).json(
            {
                "message":"access token expired"
            }
           )
        }
    }
)

export default authMiddeware