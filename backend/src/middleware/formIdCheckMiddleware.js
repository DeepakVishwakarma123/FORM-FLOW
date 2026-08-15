/*
middleware yeh check karega ki form id valid hai ki nhi validation start karne se pehle hi
isse fayda yeh hoga ki valid form id wale fiedl pe hi server processing main time spend karega wrong request
ko jaldi fak sakte hai
*/

import asyncHandler from "../utils/Async-Handler.js";
import forms from "../models/form.model.js";

let formIdMiddleware=asyncHandler(
    async function (req,res,next) {
         let {formid}=req.params
        let isFormExist=await forms.findOne({_id:formid})
        
        if(isFormExist===null)
        {
            res.status(404).send("<h1>FORM ID NOT FOUND INVALID FORMID PLEASE USE VALID FORM ID  TO SUBMIT FORM TO OUR SERVICE</h1>")
            return
        }
        next()
    }
)

export {formIdMiddleware}