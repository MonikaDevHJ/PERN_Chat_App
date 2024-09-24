import { Request, Response } from "express";
import prisma from "../db/prisma";

import bcryptjs from "bcryptjs"

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    if (password! == confirmPassword) {
      return res.status(400).json({ error: "Password do not match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ error: "UserName already exists" });
    }

    
    const salt = await bcryptjs.genSalt(10);
    const handlePassword = await bcryptjs.hash(password , salt);

  } catch (error) {}
};

export const login = async (req: Request, res: Response) => {
  // Your login logic
};

export const logout = async (req: Request, res: Response) => {
  // Your logout logic
};
