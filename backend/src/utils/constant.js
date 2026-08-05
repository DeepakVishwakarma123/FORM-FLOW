import countries from "i18n-iso-countries";
import parsePhoneNumberFromString from "libphonenumber-js";
import customs from "../models/custom-model.js";
import values from "../models/value-model.js";

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


/*yeh kya karega ki ek text ke basis pe hamare form fields ke ander se cheezo ek grop main add karega like ke array return karega
jaise hamare pass jo request body se data aa raha hai woh kya hai ki abhi usme sara cheez kis order main 
hume pata nhi hai and hume fields ko unke nature ke hissab se different collection main dalana hai yaa
appropriate field pe add karan hai 

neech diya gya jo function hai woh kya kareg ek text yaa basiclly kuch text ke basis pe 
jo field main woh text hai unka array return milega baki ke nhi milegne and hume us unke basis pe hume us dal denge uske kaam
ke collection ke ander db main kuch is tarah se kaam apna hoga
*/
function filterArrayBased(filterText,ArrayTobefilter){
 let filteredArray=ArrayTobefilter.filter(
      (fieldKeyName) => {
         return fieldKeyName.includes(filterText)
      }
   )
   return filteredArray
}
function filterArrayOfObjectBased(filterText,ArrayOfObject,propertyToCheck){
 let filteredArray=ArrayOfObject.filter(
      (fieldKeyName) => {
         //search for spedfic fields
         return fieldKeyName[propertyToCheck].includes(filterText)
      }
   )
   return filteredArray
}




let iterateOverFieldsAndAddThemIntoDatabase=  async  (fieldWityBlockTypeAttribute,userData,submissionid,apppropriateBlockTypeId) => {
                
                fieldWityBlockTypeAttribute.forEach(
                async (fieldKeyNames) => {
                     let extractingSecondDashPostion=fieldKeyNames.lastIndexOf("-")
                     let propertyNameExtract=fieldKeyNames.slice(extractingSecondDashPostion+1)
                     let propertyValue=userData[fieldKeyNames]
                     let findDoc=await customs.findOne(
                        {
                           propertyName:propertyNameExtract
                        }
                     )
                     //
                     if(findDoc)
                     {

                                  await values.create(
                                                   {
                                                   propertyId:findDoc._id,
                                                   value:propertyValue
                                                   }
                                                )
                            return
                     }
                     else{
                        
                        let currentDoc=await customs.create(
                                        {
                                         subid:submissionid,
                                         blockid:apppropriateBlockTypeId,
                                         propertyName:propertyNameExtract
                                         }
                                        )
                                       await values.create(
                                          {
                                          propertyId:currentDoc._id,
                                          value:propertyValue
                                          }
                                          )
                     }
                    }
                )
            }

// i can write a better function for above purose let think in future again how to do this to avoid faltu things
// let validFieldsArray=["sender","text","url","date","country","email","phone","number","rating"]

        

export  {verifyPhoneNumberStructure,Alpha2ISOCountryCode,filterArrayBased,filterArrayOfObjectBased,iterateOverFieldsAndAddThemIntoDatabase}