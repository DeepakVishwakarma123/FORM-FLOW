import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";
import { validBlockTypes } from "../utils/constant.js";

let cutomFieldSchema=mongoose.Schema(
    {
        fieldName:{
            type:String
        },
        blockType:{
            type:String,
            enum:validBlockTypes
        },
        formid:{
            type:Schema.Types.ObjectId,
            ref:"forms"
        }
    }
)

let customFields=mongoose.model("customField",cutomFieldSchema)

export default customFields