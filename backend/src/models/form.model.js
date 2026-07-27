import mongoose, { Model } from "mongoose"
import { Schema } from "mongoose"


const formSchema=new Schema(
    {
        formname:{
            type:String,
            require:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:"users"
        },
        formId:{
            type:String
        }
    }
)

const forms=new mongoose.model("form",formSchema)

export default forms