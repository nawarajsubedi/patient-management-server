import { Request, Response } from "express";
import { Result } from "@common/core/Result";
import { AppError, MessageEnums, HttpCode } from "@common/exceptions/appError";

import * as ETLService from "@modules/ETL/services/ETL.service";
import { parseCSVFile } from "../csvUtils/parser";
import { PatientInfoContainer } from "../csvUtils/interface";
import logger from "@/utils/logger";

/**
 * Function to handle CSV file upload
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const uploadCSVFile = async (req: Request, res: Response) => {
  const csvFilePath = req.file.path;

  try {
    const { validationErrors, ...rest } = await parseCSVFile(csvFilePath);

    if (validationErrors.length) {
      return res.status(HttpCode.BAD_REQUEST).json(validationErrors);
    }

    const data = await ETLService.updateObservationData(
      rest as PatientInfoContainer
    );
    return res.status(HttpCode.CREATED).json(data);
  } catch (error) {
    logger.error(error);
    const customError = AppError.internalServerError(
      MessageEnums.CSV_UPLOAD_ERROR
    );
    return res
      .status(customError.httpCode)
      .json(Result.fail(customError.message));
  }
};
