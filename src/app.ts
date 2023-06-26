import express, { Express } from "express";
import cors from "cors";

import "express-async-errors";

import userRouter from "@modules/users/routes/user.route";
import patientRouter from "@modules/patients/routes/patient.route";
import ETLRouter from "./modules/ETL/routes/ETL.route";

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/etl", ETLRouter);
app.use("/patients", patientRouter);
export default app;
