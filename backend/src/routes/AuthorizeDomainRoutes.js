import {Router} from "express"
import { TrustBoundaryCheckValidatingMiddlewareForAuthorizeDomain } from "../validators/authorizeDomainValidator.js"
import { AddAuthorizeDomain } from "../controllers/authorize-domain-controller.js"

const AuthorizeDomainRouter=Router()


AuthorizeDomainRouter.route("/domainallow").post(TrustBoundaryCheckValidatingMiddlewareForAuthorizeDomain,AddAuthorizeDomain)


export default AuthorizeDomainRouter