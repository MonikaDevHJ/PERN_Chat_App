import jwt,{JwtPayload}  from "jsonwebtoken"

import { Request, Response, NextFunction,  } from "express"
import prisma  from "../db/prisma";

interface Decodedtoken extends JwtPayload{
    userId : string
}


declare global {
    namespace Express {
        export interface Request{
            user :{
                id :string
            }
        }
    }
}

const proctecRoute = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({error:"Unathorized- No Token Provided"});
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Decodedtoken;

        if(!decoded){
            return res.status(401).json({error:"Unathorized - Invalid Token"});
            }
            const user = await prisma.user.findUnique({where:{id:decoded.userId}, select:{id:true,username:true,fullName:true,profilePic:true}});

            if(!user){
                return res.status(404).json({ error:"User Not Found"})
            }
    
             req.user=user;
      
        next()
        
    }catch(error:any){
        console.log("Error in protectRoute middleWare",error.message);
        res.status(500).json({error:"Interval Server Error"});

    }
}

export default proctecRoute;