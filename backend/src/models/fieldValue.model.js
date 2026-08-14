import mongoose from "mongoose";
import { Schema } from "mongoose";


let fieldValueSchema=mongoose.Schema(
    {
        submissionId:{
            type:Schema.Types.ObjectId,
            ref:"formrecords"
        },
        customFieldId:{
            type:Schema.Types.ObjectId,
            ref:"customFields"
        },
        data:{
            type:Schema.Types.Mixed
        }

    }
)

export default fieldValueSchema

