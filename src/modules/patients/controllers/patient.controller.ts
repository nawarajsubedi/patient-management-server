import { Request, Response } from "express";
import { Result } from "@common/core/Result";
import { HttpCode } from "@common/exceptions/appError";

import { updateCSVData } from "@modules/patients/services/patient.service";
import { parseCSVFile } from "../csvUtils/parser";
import { PatientInfoContainer } from "../csvUtils/interface";

/**
 * Function to handle user signup
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const uploadCSVFile = async (req: Request, res: Response) => {
  // const user = await prisma.user.create({
  //   data: {
  //     id: "1",
  //     name: "nawaraj",
  //   },
  // });
  // console.log("user", user);

  const csvFilePath = req.file.path;
  let response: PatientInfoContainer;
  try {
    response = await parseCSVFile(csvFilePath);
  } catch (error) {
    console.error("error", error);
  }

  // console.log("array", array);

  const data = await updateCSVData(response);
  // return res.status(HttpCode.CREATED).json({ array });
  return res.status(HttpCode.CREATED).json({});
};
