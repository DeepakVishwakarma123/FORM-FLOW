import mongoose, { Model } from "mongoose"
import { Schema } from "mongoose"


const formsubmissionSchema=new Schema(
    {
        formid:{
            type:Schema.Types.ObjectId,
            ref:"forms"
        }
    }
)


const formSubmissions=new mongoose.model("formsubmission",formsubmissionSchema)

export default formSubmissions