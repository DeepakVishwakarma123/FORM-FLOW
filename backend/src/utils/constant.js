import countries from "i18n-iso-countries";
import parsePhoneNumberFromString from "libphonenumber-js";
import joi from "joi";


let validBlockTypes=["text","url","select","date","country","email","phone","number","rating"]
let validCapthcaTypes=["hcapthca","turnstile","recaptcha"]
//the alpha2 code object contaisn iso 2 alpah code as key and iso 3 alpah code as value
let alpha2CodesObject=countries.getAlpha2Codes()

 let Alpha2ISOCountryCode=Object.keys(alpha2CodesObject)
  
  let hcaptchaSiteVerfiyUrl="https://api.hcaptcha.com/siteverify"
  let cloudFlareTurnStileVerifyUrl="https://challenges.cloudflare.com/turnstile/v0/siteverify" 
  let recaptchaSiteVerifyUrl=""
  
  let verifyPhoneNumberStructure=(value,helpers) => {
            const phoneObject=parsePhoneNumberFromString(value)
            if(phoneObject.isValid())
            {
               return value 
            }
            return helpers.error("invalid phone number structure")
        }


function filterArrayBased(ArrayTobefilter){

let remainingFieldKeysArray=[]
let senderKeyArray=[]
ArrayTobefilter.forEach(
   (fieldName) =>{
      if(fieldName.includes("sender"))
      {
         senderKeyArray.push(fieldName)
      }
      else{
          remainingFieldKeysArray.push(fieldName)
      }
   }
)

return [senderKeyArray,remainingFieldKeysArray]
}

 let schemaRules=  {
        "ff-sender-firstName":joi.string().max(30),
        "ff-sender-email":joi.string().email(),
        "ff-sender-lastName":joi.string().max(30),
        "ff-sender-fullName":joi.string().max(50),
        "ff-sender-phone":joi.string().pattern(/^\+[1-9]\d{1,14}$/,"E164format").custom(verifyPhoneNumberStructure),
        "ff-sender-title":joi.string().max(10).optional(),
        "ff-sender-company":joi.string().max(15).optional(),
        "ff-sender-address":joi.string().max(60).optional(),
        "ff-sender-address2":joi.string().max(60).optional(),
        //i just added here post code we can,t verify whether it is actuly post code or not
        "ff-sender-city":joi.string().min(1).max(200),
        "ff-sender-postcode":joi.string().min(3).max(20),
        //HERE IS SOME KIND OF BUG IN THIS LINE WHY IT NOT STOPPING AT MAX LIMIT HIT
        "ff-sender-country":joi.string().max(2).valid(...Alpha2ISOCountryCode).messages({"any.only":"INVALID ISO ALPHA2 COUNTRY CODE"}),
       "ff-sender-dob":joi.date().iso().less(new Date().toISOString()).messages({"date.less":`DATE OF BIRTH  SHOULD BE LESS THAN EQUAL TO  ${new Date().toLocaleString()}`})
    }

   let customBlocksJoiSchemaRules={
        "url":joi.string().uri().message("{{#label}} must be valid url"),
        "text":joi.string().max(800),
        "number":joi.number(),
        "email":joi.string().email(),
        "rating":joi.number().min(1).max(5),
        "country":joi.string().max(2).valid(...Alpha2ISOCountryCode),
        "date":joi.date().iso().less("2060-01-01").message(
            {
                "date.less":"CAN NOT ALLOWED TO ADD DATE GREATER THAN 2060-01-01"
            }
        ),
        "select":joi.string().max(50)
    }
  

let captchaSecretVerify=async function (remoteAPIURL,captchaToken,secret_key) {
    // let do the post request to remoteAPI URL
     try {
        let response=await fetch(`${remoteAPIURL}`,{
        method:"POST",
        headers: {
					"Content-Type": "application/json",
				},
        body:JSON.stringify(
            {
                secret:secret_key,
                response:captchaToken
            }
        )
      })
      return response   
     } catch (error) {
        console.log("error occured during captcha verfication",error)
        return [error]
     }
}


        

export  {captchaSecretVerify,validCapthcaTypes,recaptchaSiteVerifyUrl,hcaptchaSiteVerfiyUrl,cloudFlareTurnStileVerifyUrl,verifyPhoneNumberStructure,validBlockTypes,Alpha2ISOCountryCode,customBlocksJoiSchemaRules,filterArrayBased,schemaRules}