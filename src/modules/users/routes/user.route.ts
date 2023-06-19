import express from "express";
import { auth } from "@common/middlewares/auth";
import {
  signinValidation,
  signupValidation,
} from "@modules/users/middlewares/validation";
import {
  getUser,
  signup,
  signin,
} from "@modules/users/controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", auth, getUser);
userRouter.post("/signup", signupValidation, signup);
userRouter.post("/signin", signinValidation, signin);

export default userRouter;
