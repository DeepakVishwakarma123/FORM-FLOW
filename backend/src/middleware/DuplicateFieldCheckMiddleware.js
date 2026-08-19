
import { set } from "mongoose";
import asyncHandler from "../utils/Async-Handler.js";


let DuplicateFieldCheckMiddleware=asyncHandler(
    async function (req,res,next) {
        let requestPayloadData=req.body
        let form_submission_fieldNameKeys=Object.keys(requestPayloadData)
        //let create a set of body data
        /*
        we know the name can
         be duplicate show we gone 
         extract all arrays of keys via
         object.keys method
         we then create set of its and compare lenght to this array to
         know if there any duplicate values show we just send remove
         duplicate field are there as error in response to 
         submit a record in forms 
         */
        let uniqueFieldNameValues=new Set(form_submission_fieldNameKeys)
        let UniquvalueTotal=uniqueFieldNameValues.size
        let mixValueTotal=form_submission_fieldNameKeys.length
        if(UniquvalueTotal<mixValueTotal)
        {
            res.status(403).json(
                {
                    "error-message":"duplicate name attributes are not allowed in form remove unwanted attribute"
                }
            )
            return
        }else{
            next()
        }
    }
)


export default DuplicateFieldCheckMiddleware