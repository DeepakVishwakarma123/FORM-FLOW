import joi from "joi"
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {verifyPhoneNumberStructure,Alpha2ISOCountryCode} from "../utils/constant.js";
import { schemaRules,customBlocksJoiSchemaRules } from "../utils/constant.js";


function createDyanmicSchemaValidation(requestBody){

  //regex pattern for valid structure like ff-blocktype-propertyname
  let pattern=/^[f]{2}-\b(text|rating|select|date|country|url|number|phone|email)-[a-z-A-Z]{2,20}$/
  let requestFields=Object.keys(requestBody)
   //filterign appropritate field who passed the regex pattern
   //passing them to next stages only
   let validFieldNames=requestFields.filter(
            (fieldNames) => {
                return pattern.test(fieldNames)
            }
        )
    //adding custom joi validatoin code for appropriate fields
    validFieldNames.forEach(
        
        (fieldName) => {
          //fieldname is string like this way ff-sender-customname
          //we want second value show we use to convert it into array
          //to access following fields and add custom schema according to it automatically
          let splittingFieldNameArray=fieldName.split("-")
          let customBlockType=splittingFieldNameArray[1]
          schemaRules[fieldName]=customBlocksJoiSchemaRules[customBlockType]
       } 
)

let formSchema=joi.object(
  schemaRules

)
return formSchema
}



function validate(req,res,next) {

    let requestBody=req.body  
    let formSchema=createDyanmicSchemaValidation(requestBody)
    let {error,value}=formSchema.validate(requestBody)  
    
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

