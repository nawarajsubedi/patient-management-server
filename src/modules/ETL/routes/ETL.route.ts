import express, { Router } from "express";
import { auth } from "@common/middlewares/auth";
import fileUpload from "../middlewares/fileUpload";
import { uploadCSVFile } from "../controllers/ETL.controller";

const ETLRouter: Router = express.Router();

ETLRouter.post("/csv-upload", auth, fileUpload.single("file"), uploadCSVFile);

export default ETLRouter;
