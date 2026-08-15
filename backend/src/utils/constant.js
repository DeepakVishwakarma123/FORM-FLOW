import countries from "i18n-iso-countries";
import parsePhoneNumberFromString from "libphonenumber-js";



let validBlockTypes=["text","url","date","country","email","phone","number","rating"]

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






        

export  {verifyPhoneNumberStructure,validBlockTypes,Alpha2ISOCountryCode,filterArrayBased}
// export  {verifyPhoneNumberStructure,validBlockTypes,Alpha2ISOCountryCode,filterArrayBased,filterArrayOfObjectBased,iterateOverFieldsAndAddThemIntoDatabase}