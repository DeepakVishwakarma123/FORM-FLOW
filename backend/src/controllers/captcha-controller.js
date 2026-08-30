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
       if(captchaType==="turnstile")
       {
        //do something
        let updatedDocument=await captchas.findOneAndUpdate(
        {formid:formid},
        {
             $set:{
                 "turnstile.secret_key":captchaSecret
               }
        },
        {new:true}
       )

       }
       else if(captchaType==="hcaptcha")
       {
        //do something
        let updatedDocument=await captchas.findOneAndUpdate(
        {formid:formid},
        {
             $set:{
                 "hcaptcha.secret_key":captchaSecret
               }
        },
        {new:true}
       )
       }
       else if(captchaType==="recaptcha")
       {
        //do something
          let updatedDocument=await captchas.findOneAndUpdate(
        {formid:formid},
        {
             $set:{
                 "recaptcha.secret_key":captchaSecret
               }
        },
        {new:true}
       )
       }
       else{
        res.status(422).json(
            {
                "message":`${captchaType} is not a valid option only supported captchas are turnstile,recapthca,hcaptcha feel free to contact us`
            }
        )
        return
       }

       /*agar upar diye gye sare message option fail nhi honge i mean
       agar koi bhi conditin if ya else ki agar satisfied hogi toh us case main yeh 
       automatically response main chala jayega*/
       res.status(201).json(
        {
            message:`${captchaType} secret Key Succesfully add`
        }
       )
    }
)

export {Addcaptcha}