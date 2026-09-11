//middleware to detect authorize domains


import asyncHandler from "../utils/Async-Handler.js";
import forms from "../models/form.model.js";


//the authrize domain middleware blocks invalid id and as well as  checks for domani if there are allowed domains
let AuthorizeDomainMiddleware=asyncHandler(
    async function (req,res,next) {
        //gather the request header and grab origin information show we get know from where reques is coming 
        //we know that when request or form submissin is getting held we get form id in parmas as well
        //we use it to grab the form document here and match it with request origin domain whether it matches or not
        let requestOriginDetails=req.get('origin')
        //let first search whether id exist or not 
        let {formid}=req.params
        let isFormExist=await forms.findOne({_id:formid})
        
        if(isFormExist===null)
        {
            res.status(404).send("<h1>FORM ID NOT FOUND INVALID FORMID PLEASE USE VALID FORM ID  TO SUBMIT FORM TO OUR SERVICE</h1>")
            return
        }
        //otherwise extract allowedDomain Field 
        let AllowedDomainsArray=isFormExist.AllowedDomains
        //if array contains length zero means there are no domains are in service are associated with it 
        //otherwise we have to check for each one to match agains valid ones 
            if(AllowedDomainsArray.length===0)
            {
                next()                
            }
            else{
                //otherwise searching and validating things
                for(let indexCount=0;indexCount<AllowedDomainsArray.length;indexCount++)
                {
                    //matching whether domains name includes with exsting origin or not 
                    let domainName=AllowedDomainsArray[indexCount]
                    if(requestOriginDetails.includes(domainName))
                    {
                        next()
                    }
                    else{
                        break;
                    }
                }
                res.status(403).json(
                    {
                        "message":"unprocessable request domain is not allowed",
                        "excludedDomain":requestOriginDetails
                    }
                )
            }
    }
)


export {AuthorizeDomainMiddleware}