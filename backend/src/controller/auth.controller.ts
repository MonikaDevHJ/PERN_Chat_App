import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/GenerateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // Check if all fields are filled
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if username already exists
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Assign gender-specific profile pictures
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic
      }
    });

    // If user created successfully, generate a token and send response
    if (newUser) {
      generateToken(newUser.id, res);
      return res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("Error in Sign Up controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// function generateToken(id: string, res: Response<any, Record<string, any>>) {
//   throw new Error("Function not implemented.");
// }

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "Invalid credential" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credential" });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic
    });
  } catch (error: any) {
    console.log("error In Login controller", error.message);
    res.status(500).json({error:"Internal Server Error"})
  }
};

export const logout = async (req: Request, res: Response) => {
  try{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json ({message:"Logged Out Succesfully"});
  }catch(error:any){
    console.log("Error in logout controller ", error.message);
    res.status(500).json({error: "Internal Server Error"})
  }
};


export const getMe = async (req:Request, res:Response)=>{
  try{
    const user = await prisma.user.findUnique({where:{id:req.user.id}});

    if(!user){
      return res.status(404).json({error : "USer not found"})
    }

   res.status(200).json({
    id:user.id,
    fullName : user.fullName,
    userName : user.username,
    profilePic : user.profilePic,
   });

  }catch(error:any){
    console.log("Error in getMe controller", error.message);
    res.status(500).json({error:"Interval Server Error"})
  }
};