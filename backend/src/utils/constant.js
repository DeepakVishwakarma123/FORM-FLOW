import countries from "i18n-iso-countries";
  

//the alpha2 code object contaisn iso 2 alpah code as key and iso 3 alpah code as value
let alpha2CodesObject=countries.getAlpha2Codes()

 let Alpha2ISOCountryCode=Object.keys(alpha2CodesObject)
  
  
  
  let verifyPhoneNumberStructure=(value,helpers) => {
            const phoneObject=parsePhoneNumberFromString(value)
            if(phoneObject.isValid())
            {
               return value 
            }
            return helpers.error("invalid phone number structure")
        }


        

export  {verifyPhoneNumberStructure,Alpha2ISOCountryCode}