import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import { validCapthcaTypes } from "../utils/constant.js";




let captchaSchema=mongoose.Schema(
    {
        captcha:{
            hcaptcha:{
                  secret_key:{
                    type:String,
                    default:""
        },
        isActive:{
            type:Boolean,
            default:false
        }
            },
            turnstile:{
                  secret_key:{
                    type:String,
                    default:""
        },
        isActive:{
            type:Boolean,
            default:false
        }
            },
            recaptcha:{
                  secret_key:{
                    type:String,
                    default:""
        },
        isActive:{
            type:Boolean,
            default:false
        }
            },
            nocaptcha:{
                isActive:{
                    type:Boolean,
                    default:true
                }
            }
        },
        formid:{
            type:Schema.Types.ObjectId,
            ref:"forms"
        }
    }
)

let captchas=mongoose.model("captcha",captchaSchema)

export default captchas