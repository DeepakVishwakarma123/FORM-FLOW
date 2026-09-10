async function TrustBoundaryCheckValidatingMiddlewareForAuthorizeDomain(req,res,next) {
    let {AllowedDomains}=req.body
    let pattern=/^[a-z-A-z]{1,63}[.]?[a-z-A-z]{1,63}?[.]?[a-z-A-Z]{2,63}$/
    for(let indexCount=0;indexCount<AllowedDomains.length;indexCount++)
    {
        let domainName=AllowedDomains[indexCount]
        let isdomainNamePassedPattern=pattern.test(domainName)
        if(isdomainNamePassedPattern===false)
        {
             res.status(400).json(
                  {
                    "error-message":"Add domain(s), plus any subdomains to be whitelisted. A valid domain requires a host and must not include any path, port, query or fragment.",
                  }
                )
                break;
        }
    }
    //passing request to next middleware if no error found by default othervise rejecting from above directly
    next()
}

//a.b.com


export {TrustBoundaryCheckValidatingMiddlewareForAuthorizeDomain}


