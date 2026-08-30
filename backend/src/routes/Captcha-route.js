import { activateSpeficCapthca, Addcaptcha } from "../controllers/captcha-controller.js";
import {Router} from 'express'

const captchaRouter=Router()

captchaRouter.route("/addsecretkey").post(Addcaptcha)

captchaRouter.route("/activate").post(activateSpeficCapthca)
// captchaRouter.route("/activate").post(Addcaptcha)

export {captchaRouter}