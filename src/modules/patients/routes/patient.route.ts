import express, { Router } from "express";
import { auth } from "@common/middlewares/auth";
import {
  getAllPatients,
  getPatientDetails,
  getDashboardReport,
} from "@modules/patients/controllers/patient.controller";

const patientRouter: Router = express.Router();

patientRouter.get("/", auth, getAllPatients);
patientRouter.get("/dashboard", auth, getDashboardReport);
patientRouter.get("/:id", auth, getPatientDetails);

export default patientRouter;
