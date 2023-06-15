import express, { Request, Response, Router } from "express";
import multer, { FileFilterCallback } from "multer";
import { auth } from "@common/middlewares/auth";
import { validation } from "@modules/users/middlewares/validation";
import { uploadCSVFile } from "@modules/patients/controllers/patient.controller";
import fileUpload from "../middlewares/file-upload";

const patientRouter: Router = express.Router();

patientRouter.post("/csv-upload", fileUpload.single("file"), uploadCSVFile);

export default patientRouter;
