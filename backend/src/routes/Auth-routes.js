import { Router } from "express";
import  { signIn,signUp } from "../controllers/auth-controller.js";
import authMiddeware from "../middleware/authmiddleware.js";
import protectedRoute from "../controllers/protected-route.js";


const authRouter=Router()

authRouter.route("/signup").post(signUp)
authRouter.route("/signin").post(signIn)

authRouter.route("/secure").post(authMiddeware,protectedRoute)

export default authRouter