import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token 
        || req.body.token 
        || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        req.role = decode.userRole;
        next();
    } catch (error) {
        console.log(error);
    }
}

export const isRecruiter = async(req,res,next) => {
    try {
        if (req.role !== "recruiter") {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Recruiter only"
            })
        }
        next();
    } catch (error) {
        console.error("Error in isRecruiter middleware:", error);
        return res.status(500).json({
            success:false,
            message: "You are not a Recruiter"
        })
    }
}

export const isStudent= async(req,res,next) => {
    try {
        if (req.role !== "student") {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Student only"
            })
        }
        next();
    } catch (error) {
        console.error("Error in isStudent middleware:", error);
        return res.status(500).json({
            success:false,
            message: "You are not a Student"
        })
    }
}