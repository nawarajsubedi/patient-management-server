import express, { Router } from "express";
import { auth } from "@common/middlewares/auth";
import {
  uploadCSVFile,
  getAllPatients,
  getPatientDetails,
} from "@modules/patients/controllers/patient.controller";
import fileUpload from "../middlewares/fileUpload";

const patientRouter: Router = express.Router();

patientRouter.post(
  "/csv-upload",
  auth,
  fileUpload.single("file"),
  uploadCSVFile
);

patientRouter.get("/", auth, getAllPatients);
patientRouter.get("/:id", auth, getPatientDetails);

export default patientRouter;
