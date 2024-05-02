const { validateToken } = require("../utility/auth")

module.exports.checkForAuthenticationCookie=function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
   
        const tokenCookieValue=req.cookies[cookieName]//checking if the jwt-cookie is there
 
        if(!tokenCookieValue){
            return next()
        }
 
        try {
            const userPayload=validateToken(tokenCookieValue)//if jwt-cookie is there then store the payload
            req.user=userPayload//userPayload will contain basic data that is stored in req.user, and checkForAuthenticationCookie being a miidleware req.user will be accesable after this middleware
        } catch (error) {
            console.log('token validation error ',error);
        }

        return next()
    }
}

