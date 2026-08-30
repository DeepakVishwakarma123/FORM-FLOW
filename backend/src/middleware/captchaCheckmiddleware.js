/*
captcha activated hai ki nhi hume yeh check karna hai currently 
agar hai toh usko appropriate hume middleware ko pass kar dena hai based 
on it
*/

import captchas from "../models/captcha-models.js";
import asyncHandler from "../utils/Async-Handler.js";
import { captchaSecretVerify, cloudFlareTurnStileVerifyUrl, hcaptchaSiteVerfiyUrl, recaptchaSiteVerifyUrl } from "../utils/constant.js";


let captchaCheckmiddleware=asyncHandler(
async function (req,res,next) {
    let formdid=req.params

    let nocaptchaSearch=await captchas.findOne(
        {
            formid:formid,
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
            formid:formid,
            "hcaptcha.isActive":true
        }
    )

    if(hcaptchaSearch)
    {
      let secret_key=hcaptchaSearch.hcaptcha.secret_key
      let hcaptchaResponseToken=req.body["h-captcha-response"]
      let response=captchaSecretVerify(hcaptchaSiteVerfiyUrl,hcaptchaResponseToken,secret_key)
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
         console.log(response);
          let success=response.success
         if(success)
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

    let recaptchaSearch=await captchas.findOne(
        {
            formid:formid,
            "recaptcha.isActive":true
        }
    )

    if(recaptchaSearch)
    {
      let secret_key=recaptchaSearch.recaptcha.secret_key
      let recaptchaResponseToken=req.body["g-recaptcha-response"]
      let response=captchaSecretVerify(recaptchaSiteVerifyUrl,recaptchaResponseToken,secret_key)
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
         console.log(response);
         let success=response.success
         if(success)
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
      let response=captchaSecretVerify(cloudFlareTurnStileVerifyUrl,turnstilecaptchaResponseToken,secret_key)
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
         console.log(response);
          let success=response.success
         if(success)
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

    }
    //captcha milne per hume usko verify karna hai 
    //uske spefic api pe requst karke and yeh tab karneg jab spefic captcha milega
)

export default captchaCheckmiddleware