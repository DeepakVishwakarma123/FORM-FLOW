//configure captcha controller 
// active captcha mode ---recapthca,turnstile,hcapthca

import mongoose from "mongoose";
import asyncHandler from "../utils/Async-Handler.js";
import captchas from "../models/captcha-models.js";

// for now we are going with turnstile only

let Addcaptcha=asyncHandler(
    async function (req,res) {
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

// activate spefic captcha mode the above same code get duplicated with some new fiedl updation
let activateSpeficCapthca=asyncHandler(

      async function (req,res) {
        //hume yeh fields body main milengi
        let {formid,captchaType}=req.body


        /*
        kahani twist yeh hai ki jo captcha activated hai already usko false bhi karna padega
        like jaise is case main no captcha already tha to use pehle false karna padega 
        per aisa nhi hai ki her baar baar nocaptcha hi rahega maan lo ek baar
        turnstile active hua then usne dusra kuch again acive karna chaha toh
        us turnstile active hai to hume use band karna padega 
        */

        // pehel hume true wale captcha ko false set karna hai then 
        //baki jo activate hona chhat hai use true set kar do 
        //abhi ke liye hum spefic her ko database main call karke hume use false set kareneg agar vo milta hai toh

        /*
        main yaha pe kuch built in methods se niaklane wala huu us spefic object ko
        */

     let nocaptchaUpdatesettofalse=await captchas.findOneAndUpdate(
            {
            "nocaptcha.isActive":true,
            formid:formid
            },
            {
                $set:{
                    "nocaptcha.isActive":false 
                }
            }
        )
 let hcaptchaUpdatesettofalse=await captchas.findOneAndUpdate(
            {
            "hcaptcha.isActive":true,
            formid:formid
            },
            {
                $set:{
                    "hcaptcha.isActive":false 
                }
            }
        )
 let turnstileUpdatesettofalse=await captchas.findOneAndUpdate(
            {
            "turnstile.isActive":true,
            formid:formid
            },
            {
                $set:{
                    "turnstile.isActive":false 
                }
            }
        )

       if(captchaType==="turnstile")
       {
        //do something
        let updatedDocument=await captchas.findOneAndUpdate(
        {formid:formid},
        {
             $set:{
                 "turnstile.isActive":true
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
                 "hcaptcha.isActive":true
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
                 "recaptcha.isActive":true
               }
        },
        {new:true}
       )
       }
       else{
        res.status(422).json(
            {
                "message":`invalid capthca mode not supported ${captchaType}`
            }
        )
        return
       }

       res.status(201).json(
        {
            message:`${captchaType} activated succesfully`
        }
       )
    }
)

export {Addcaptcha,activateSpeficCapthca}