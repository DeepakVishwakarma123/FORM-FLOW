import formSubmissions from "../models/submission.model.js";
import forms from "../models/form.model.js";
import ObjectId from "mongoose"
import mongoose from "mongoose";
import users from "../models/user-model.js";
import convertMJML2HTML from "./compilerMJML2HTML.js";
import sendmail from "./sendMail.js";

async function aggregationPipelineFactory(submissionid) {
        try {
            let id=new mongoose.Types.ObjectId(submissionid)
            //the aggregation results array of found data objects
            let senderBasicRecordArray=await formSubmissions.aggregate(
                                [
                               {
                               $match: {
                               _id:id
                                      }
                               },
                               {
                                $project:{
                                    __v:0
                                }
                               }
                                  ]
                              )

                              
            let submissionRecordDoc=senderBasicRecordArray[0]
       //remove the form id field as schema doesn,t has show i think you have to re run code for first time for propert setups to avoid old setups
       let formInformationDataArray=await forms.aggregate(
        [
            {
                $match:{
                    _id:submissionRecordDoc["formid"]
                }
            },
            {
             $project: {
               _id:0,
               __v:0
            }
            }
            
        ]
       )

       let formRecordObject=formInformationDataArray[0]
       
   
       //this pipeline has some problems and need to be fixed soon!!!
       let userinfoArray=await users.aggregate(
        [
            {
                $match:{
                    _id:formRecordObject["userId"]
                }
            }
            
        ]
       )
       let userObject=userinfoArray[0]
       
       let senderDetailsObject=submissionRecordDoc["sender"]
       let formtitle=formRecordObject["formname"]
       let emailId=userObject.emailId
        
       
       
       console.log("the email id is",emailId);
       
    
       let htmlString=await convertMJML2HTML(senderDetailsObject,formtitle)

       sendmail(htmlString,emailId)    
    }
         catch (err) {
            console.log("somethign happended",err);
            
        }

      

}



export {aggregationPipelineFactory}

