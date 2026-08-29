//configure captcha controller 
// active captcha mode ---recapthca,turnstile,hcapthca

import mongoose from "mongoose";
import asyncHandler from "../utils/Async-Handler.js";
import captchas from "../models/captcha-models.js";

// for now we are going with turnstile only

let Addcaptcha=asyncHandler(
    async function (req,res,next) {
        //hume yeh fields body main milengi
        let {formid,captchaType,captchaSecret}=req.body

        /*mujhe yeh nhi pata ki kaunsa captcha type aane wala hai 
        but main already unhe default value ke create kar chuka huu doc ko 
        toh main formid se unhe get karunga and specfic captcha type wali value ko update 
        kar dunga
        */
       let captchaTypeDocHolder={
        captchaType
       }
       let updatedDocument=await captchas.findOneAndUpdate(
        {formid:formid},
        {
             "captchaType.secret_key":captchaSecret
        },
        {new:true}
       )

       res.status(201).json(
        {
            message:`${captchaType} secret Key Succesfully add`
        }
       )
    }
)

export {Addcaptcha}