
const jwt = require("jsonwebtoken");


// This is a middleware function that checks if a user is authorized to access a certain resource.

const Authentication = async (req, res, next) => {

    const token = req.headers?.authorization?.split(" ")[1]
    try{
        if(token){
            const decoded = jwt.verify(token, process.env.KEY)
            // Check if the decoded user ID matches the ID parameter in the request.
            if(decoded){
                const userID = decoded.email
                req.body.userID = userID

                // If the user is authorized, move on to the next middleware function.
                next()
            }
            else{
                // If the user is not authorized, return a 401 (Unauthorized) error.
                return res.status(401).json({ message: "Unauthorized"});
            }  
        }

        else{
            // If no token is present in the request headers, return a 401 (Token is Empty) error.
            return res.status(401).json({ message: "Token is empty"});
        }
    }
    catch{
        // If there's an error during the authorization process, return a 404 (Not Found) error.
        return res.status(401).json({ message: "Unauthorized"});
    }
}


module.exports = {Authentication}
