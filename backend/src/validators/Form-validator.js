import joi from "joi"
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {verifyPhoneNumberStructure,Alpha2ISOCountryCode} from "../utils/constant.js";


function createDyanmicSchemaValidation(requestBody){

    console.log("inside dynamic validationfuncoitn here 😀");
 
    //basic schema rule object
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
  
  //regex pattern for valid structure like ff-blocktype-propertyname
  let pattern=/^[f]{2}-\b(text|rating|select|date|country|url|number|phone|email)-[a-z-A-Z]{2,20}$/
 
  //converting requestbody keys into array
  //i think i have to log requestbody before procedding it
  //let see what happen when we run actual code
  console.log("the request body is now",requestBody)
  let requestFields=Object.keys(requestBody)

  console.log(requestFields)
   //filterign appropritate field who passed the regex pattern
   let validFieldNames=requestFields.filter(
            (fieldNames) => {
                return pattern.test(fieldNames)
            }
        )
        console.log("valid field names are",validFieldNames);


    
    //adding custom joi validatoin code for appropriate fields
    validFieldNames.forEach(
        
        (fieldName) => {
        console.log("hello hii ho ware you");
        if(fieldName.includes('url'))
        {
        //addign custom error message here to avid confusion of uri
        schemaRules[fieldName]=joi.string().uri().message("{{#label}} must be valid url")
        }
        if(fieldName.includes('text'))
        {
        //NOT GIVING MINIMUM VALUE  FOR WRITE NOW
        schemaRules[fieldName]=joi.string().max(800)
        }
        if(fieldName.includes('number'))
        {
        schemaRules[fieldName]=joi.number()
        }
        if(fieldName.includes('email'))
        {
        schemaRules[fieldName]=joi.string().email()
        }
        if(fieldName.includes('rating'))
        {
        schemaRules[fieldName]=joi.number().min(1).max(5)
        }
        if(fieldName.includes('country'))
        {
        schemaRules[fieldName]=joi.string().max(2).message("{{#label}} iso alpha2 code should be max 2 character").valid(...Alpha2ISOCountryCode)
        }
        if(fieldName.includes('date'))
        {
            // 2060 year 1 januar first din se kam wali sare date allowed hai uske upar wali nhi allowed hai
        schemaRules[fieldName]=joi.date().iso().less("2060-01-01").messages(
            {
                "date.less":"CAN NOT ALLOWED TO ADD DATE GREATER THAN 2060-01-01"
            }
        )
        }
    }
)

let formSchema=joi.object(
  schemaRules
)



return formSchema
}

/*this will not write approach but let'see its pros and cons
let see how much time it take to server bascilly
*/

function validate(req,res,next) {
    console.log("hello inside validate function");
    
    let requestBody=req.body
    let formSchema=createDyanmicSchemaValidation(requestBody)
    let {error,value}=formSchema.validate(req.body)  
    console.log("valid values are",value);
    
   if(error===undefined)
    {
        next()
        return
    }
  res.status(200).json(
    {
     "error details":error["details"][0]
    }
  )
}


export default validate

// ^[+]([1-9]{2}[1-9]?[0-9]*){3,15}

