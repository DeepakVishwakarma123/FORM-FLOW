import mongoose from "mongoose"
import { Schema } from "mongoose"


let valueCustomSchema=mongoose.Schema(
    {
        value:{
            type:String
        },
        customfieldId:{
            type:Schema.Types.ObjectId,
            ref:"customFields"
        },
        subid:{
            type:Schema.Types.ObjectId,
            ref:"formrecords"
        }
    }
)

let customValues=mongoose.model("customValues",valueCustomSchema)
export default customValues