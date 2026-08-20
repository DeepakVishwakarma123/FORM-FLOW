import Router from "express"
import { CreateForm } from "../controllers/Form-Controller.js"
import { RecordSubmission } from "../controllers/Form-Controller.js"
import validate from "../validators/Form-validator.js"
import { formIdMiddleware } from "../middleware/formIdCheckMiddleware.js"


const formRouter=Router()


formRouter.route("/createform").post(CreateForm)
formRouter.route("/submit/:formid").post(formIdMiddleware,validate,RecordSubmission)



export default formRouter