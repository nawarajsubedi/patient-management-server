import express, { Express } from "express";
import "express-async-errors";

import userRouter from "@modules/users/routes/user.route";
import patientRouter from "@modules/patients/routes/patient.route";

const app: Express = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/patients", patientRouter);
export default app;
