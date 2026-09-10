/*
captcha activated hai ki nhi hume yeh check karna hai currently 
agar hai toh usko appropriate hume middleware ko pass kar dena hai based 
on it
*/

import mongoose from "mongoose";
import captchas from "../models/captcha-models.js";
import asyncHandler from "../utils/Async-Handler.js";
import {formurlenocdecaptchaSecretVerify,cloudFlareTurnStileVerifyUrl, hcaptchaSiteVerfiyUrl, recaptchaSiteVerifyUrl } from "../utils/constant.js";


let captchaCheckmiddleware=asyncHandler(
async function (req,res,next) {   
    
    let body=req.body
    let {formid}=req.params
    let formidvalidform=new mongoose.Types.ObjectId(formid)
    let nocaptchaSearch=await captchas.findOne(
        {
            formid:formidvalidform,
            "nocaptcha.isActive":true
        }
    )

  
    //in the case of no captcha we just passing request to next middleware
    if(nocaptchaSearch)
    {
        next()
    }



    /*
    this function use as universal function across three captchas to 
    resolve site verify api token response and decideds whether to surpass user request
    to next middleware or not
    */

    function captchaStatus_Checker(response)
    {
        console.log("the response object is here",response);
        
       if(response.length===1)
       {
        res.status('408').json(
            {
                "message":response
            }
        )
       }
       else{
         let success=response.success
         console.log("success as respnose field value",success);
         console.log(typeof(success));
         
         if(success===true)
         {               
            next()
         }
         else{
         res.status(404).json(
                {
                    "message":{
                        captchaResponse:response
                    }
                }
            )
        }
       }
    }


    let hcaptchaSearch=await captchas.findOne(
        {
            formid:formidvalidform,
            "hcaptcha.isActive":true
        }
    )

    if(hcaptchaSearch)
    {
      let secret_key=hcaptchaSearch.hcaptcha.secret_key
      let hcaptchaResponseToken=req.body["h-captcha-response"]
      let response=await formurlenocdecaptchaSecretVerify(hcaptchaSiteVerfiyUrl,hcaptchaResponseToken,secret_key)
      captchaStatus_Checker(response)
    }

    let recaptchaSearch=await captchas.findOne(
        {
            formid:formidvalidform,
            "recaptcha.isActive":true
        }
    )

    if(recaptchaSearch)
    {
      let secret_key=recaptchaSearch.recaptcha.secret_key
      let recaptchaResponseToken=req.body["g-recaptcha-response"]
      let response=await formurlenocdecaptchaSecretVerify(recaptchaSiteVerifyUrl,recaptchaResponseToken,secret_key)
      captchaStatus_Checker(response)
    }


     let turnstilecaptchaSearch=await captchas.findOne(
        {
            formid:formid,
            "turnstile.isActive":true
        }
    )

    if(turnstilecaptchaSearch)
    {
      let secret_key=turnstilecaptchaSearch.turnstile.secret_key
      let turnstilecaptchaResponseToken=req.body["cf-turnstile-response"]
      let response=await formurlenocdecaptchaSecretVerify(cloudFlareTurnStileVerifyUrl,turnstilecaptchaResponseToken,secret_key)
      captchaStatus_Checker(response)
    }

    }
    //captcha milne per hume usko verify karna hai 
    //uske spefic api pe requst karke and yeh tab karneg jab spefic captcha milega
)

export default captchaCheckmiddleware