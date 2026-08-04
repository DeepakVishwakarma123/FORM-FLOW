import mongoose from "mongoose";
import { Schema } from "mongoose";

let blockTypeSchema=new Schema(
    {
        blockname:{
            type:String
        }
    }
)

let blockTypes=mongoose.model("blockType",blockTypeSchema)



export default blockTypes


