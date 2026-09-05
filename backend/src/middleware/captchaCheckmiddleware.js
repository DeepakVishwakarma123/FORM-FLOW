/*
captcha activated hai ki nhi hume yeh check karna hai currently 
agar hai toh usko appropriate hume middleware ko pass kar dena hai based 
on it
*/

import mongoose from "mongoose";
import captchas from "../models/captcha-models.js";
import asyncHandler from "../utils/Async-Handler.js";
import {formurlenocdecaptchaSecretVerify,removeCapthcaHiddenFieldFromRequestBody, cloudFlareTurnStileVerifyUrl, hcaptchaSiteVerfiyUrl, recaptchaSiteVerifyUrl } from "../utils/constant.js";


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
      if(response.length===1)
       {
        res.status('408').json(
            {
                "message":response
            }
        )
       }
       else{
         //just verfiy success field whats' it status 
          let success=response.success
         if(success===true)
         {    
            let anotherObject=removeCapthcaHiddenFieldFromRequestBody(body)
            req.body=anotherObject            
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
      if(response.length===1)
       {
        res.status('408').json(
            {
                "message":response
            }
        )
       }
       else{
         //just verfiy success field whats' it status 
         let success=response.success
         if(success===true)
         {       
           let anotherObject=removeCapthcaHiddenFieldFromRequestBody(body)
            req.body=anotherObject
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
      if(response.length===1)
       {
        res.status('408').json(
            {
                "message":response
            }
        )
       }
       else{
         //just verfiy success field whats' it status 

          let success=response.success
         if(success)
         {
            let anotherObject=removeCapthcaHiddenFieldFromRequestBody(body)
            req.body=anotherObject
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

    }
    //captcha milne per hume usko verify karna hai 
    //uske spefic api pe requst karke and yeh tab karneg jab spefic captcha milega
)

export default captchaCheckmiddleware