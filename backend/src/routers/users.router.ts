import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";

import { Router } from "express";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
const router = Router();

// Login

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(400).send("Username or password incorrect");
    }
  })
);

// Register

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(401).send("Email already in use");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    };
    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  })
);

const generateTokenResponse = (user: User) => {
  if (!process.env.JWT_SECRET) {
    console.log("error found");
    throw new Error("secret token is not defined");
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user._id,
    email: user.email,
    name: user.name,

    token: token,
  };
};

export default router;
