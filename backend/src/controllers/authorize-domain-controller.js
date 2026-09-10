import forms from "../models/form.model.js";
import asyncHandler from "../utils/Async-Handler.js";

let AddAuthorizeDomain=asyncHandler(
    async function (req,res) {
        let {formid,AllowedDomains}=req.body;

        //find out form whether exist with form id or not
        let isformExist=await forms.findByIdAndUpdate({_id:formid},{AllowedDomains:AllowedDomains},{new:true})
        if(isformExist)
        {
            //do something
            res.status(200).json(
                {
                    "message":"authorize domains updated successfully",
                    "authorizedomains":AllowedDomains
                }
            )   
        }
        //send error message
        res.status(404).json(
              {
                "message":"invalid form id is not found"
              }
            )
    }
)


export {AddAuthorizeDomain}