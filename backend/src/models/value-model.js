//this will acts as value collection 
//it stores diffretn tyeps of data across diffrent propertys

import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";

//joi wala agar validation break hota hai toh db level pe validation itan acha nhi hai i mean db level pe blocking nhi hai laga ke rakha hai humne sab open hai karke
let valuesSchema=mongoose.Schema(
    {
        propertyId:{
            type:Schema.Types.ObjectId,
            ref:"propertys"
        },
        value:{
            type:Schema.Types.Mixed
        }
    }
)


let values=mongoose.model("values",valuesSchema)

export default  values