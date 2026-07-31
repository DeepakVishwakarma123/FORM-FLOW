import joi from "joi"
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { postcodeValidator } from "postcode-validator";
// import countries from "i18n-iso-countries";

// import en from "i18n-iso-countries/langs/en.json" assert { type: "json" };

// countries.registerLocale(en);

// let alpha2CodesObject=countries.getAlpha2Codes()

// let alpha2CodesCountry=Object.keys(alpha2CodesObject)



let formSchema=joi.object(
    {
        "ff-sender-firstName":joi.string().max(30),
        "ff-sender-email":joi.string().email(),
        "ff-sender-lastName":joi.string().max(30),
        "ff-sender-fullName":joi.string().max(50),
        "ff-sender-phone":joi.string().pattern(/^\+[1-9]\d{1,14}$/,"E164format"),
        "ff-sender-title":joi.string().max(10).optional(),
        "ff-sender-company":joi.string().max(15).optional(),
        "ff-sender-address":joi.string().max(60).optional(),
        "ff-sender-address2":joi.string().max(60).optional(),
        "ff-sender-city":joi.string().min(1).max(200),
        "ff-sender-postcode":joi.string().min(3).max(20)
        // "ff-sender-country":joi.string().valid(...alpha2CodesCountry)
    }
)



function validate(req,res,next) {
    console.log("hello inside validate function");
    
    let {error,value}=formSchema.validate(req.body)  
    console.log(error);
    console.log(value);
   if(error===undefined)
    {
        next()
        return
    }
  res.status(200).json(
    {
        error
    }
  )
}


export default validate

// ^[+]([1-9]{2}[1-9]?[0-9]*){3,15}