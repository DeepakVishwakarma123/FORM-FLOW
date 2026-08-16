import formSubmissions from "../models/submission.model.js";
import forms from "../models/form.model.js";
import ObjectId from "mongoose"
import mongoose from "mongoose";
import users from "../models/user-model.js";
import convertMJML2HTML from "./compilerMJML2HTML.js";
import sendmail from "./sendMail.js";
import customValues from "../models/customValue.js";

async function aggregationPipelineFactory(submissionid) {
        try {
            let subid=new mongoose.Types.ObjectId(submissionid)
            //the aggregation results array of found data objects
            let senderBasicRecordArray=await formSubmissions.aggregate(
                                [
                               {
                               $match: {
                               _id:subid
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

       //this pipeline has way to gather all data from database correspond to submission id

       let customFieldsArray=await customValues.aggregate(
        [
  {
    $match: {
      "subid":subid
    }
  },
  {
    $lookup: {
      from: "customfields",
      localField: "pid",
      foreignField: "_id",
      pipeline:[
        {
          $project:{
            _id:0,
            formid:0,
            __v:0
          }
        }
      ],
      as: "cfinfo"
    }
  }
  ,
  {
    $unwind:"$cfinfo"
  },
  {
    $addFields: {
      fieldName: "$cfinfo.fieldName",
    }
  },
  {
    $project: {
       _id:0,
      subid:0,
      __v:0,
      pid:0,
      cfinfo:0
    }
  }
]
       )

       //custom field array se jo mujhe result milega uska format kuch is tarah rahega
       //basiclly array of hai customfield ke data object ka hai 
       /*
      [
      {
      value:"something",
      "customfieldName":"something"
      } ,
      {
      viceversa
      }
      ]
       */

      /*
       convert karte hai ise is tarah se ki yeh apna object ki tarh ban jaye 
       and then hume ise sender details object ke sath merge karke send kar denge mjml converter per
       jo ki waha pe humne code is tarah likha hai ki wah keyName se value extract kar leta hai so this is overall
       */

       let customFieldObject={}

       for(let DataCustomFieldObject of customFieldsArray)
       {
        let fieldName=DataCustomFieldObject["fieldName"]
        let value=DataCustomFieldObject["value"]
        customFieldObject[fieldName]=value
       }
       
       console.log("the cusotm field object is now",customFieldObject)
       let userObject=userinfoArray[0]
       
       let senderDetailsObject=submissionRecordDoc["sender"]
       let formtitle=formRecordObject["formname"]
       let emailId=userObject.emailId

       Object.assign(senderDetailsObject,customFieldObject)

       let htmlString=await convertMJML2HTML(senderDetailsObject,formtitle)

       sendmail(htmlString,emailId)    
    }
         catch (err) {
            console.log("somethign happended",err);
        }
}



export {aggregationPipelineFactory}

