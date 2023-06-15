import express from "express";
import { auth } from "@common/middlewares/auth";
import { validation } from "@modules/users/middlewares/validation";
import {
  getUser,
  signup,
  signin,
} from "@modules/users/controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", auth, getUser);
userRouter.post("/signup", validation, signup);
userRouter.post("/signin", validation, signin);

export default userRouter;

// const multer = require("multer");
// const upload = multer({ dest: "tmp/csv/" });

// const csv = require("fast-csv");
// router.get("/", async (req, res, next) => {
//   // console.log(req.token);
//   try {
//     const data = await fs.readFile("patients.json", "utf8");
//     const patientList = JSON.parse(data);
//     res.json({ patients: patientList });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/upload-csv", upload.single("file"), async (req, res, next) => {
//   console.log("upload api", req.file.path);
