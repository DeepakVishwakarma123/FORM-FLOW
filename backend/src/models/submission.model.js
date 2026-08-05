import mongoose, { Model } from "mongoose"
import { Schema } from "mongoose"


const formsubmissionSchema=new Schema(
    {
        formid:{
            type:Schema.Types.ObjectId,
            ref:"forms",
            // required:[true,"formId Required"]
        },
        sender:{
            type:Object
        }
    }
)


//to modify schema after initian later use .add method on schemaObject and insert the object with appropriate fields and supoprt for it
// formsubmissionSchema.add(
//     {
//         sender:{
//             type:Object
//         }
//     }
// )

const formSubmissions=new mongoose.model("formrecord",formsubmissionSchema)

export default formSubmissions