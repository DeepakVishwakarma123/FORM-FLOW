import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";


let customSchema=mongoose.Schema(
    {
        subid:{
            type:Schema.Types.ObjectId,
            ref:"formrecords"
        },
        blockid:{
            type:Schema.Types.ObjectId,
            ref:"blockTypes"
        },
        propertyName:{
            type:String
        }
    }
)

let customs=mongoose.model("custom",customSchema)

export default customs