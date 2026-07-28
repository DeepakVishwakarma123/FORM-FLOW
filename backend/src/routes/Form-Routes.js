import Router from "express"
import { CreateForm } from "../controllers/Form-Controller.js"

const formRouter=Router()


formRouter.route("/createform").post(CreateForm)



export default formRouter