import { Request, Response } from "express";
import { Result } from "@common/core/Result";
import { HttpCode } from "@common/exceptions/appError";

import {
  fetchAllPatients,
  updateCSVData,
} from "@modules/patients/services/patient.service";
import { parseCSVFile } from "../csvUtils/parser";
import { PatientInfoContainer } from "../csvUtils/interface";
import { PaginationRequest } from "../dto/pagination.request";
import { parseValueFromQuery } from "../utils/query-string";

/**
 * Function to handle user signup
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const uploadCSVFile = async (req: Request, res: Response) => {
  const csvFilePath = req.file.path;
  let response: PatientInfoContainer;
  try {
    response = await parseCSVFile(csvFilePath);
  } catch (error) {
    console.error("error", error);
  }

  const data = await updateCSVData(response);
  return res.status(HttpCode.CREATED).json(data);
};

/**
 * Function to handle user signup
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const getAllPatients = async (req: Request, res: Response) => {
  const { page = 1, size = 10, search } = req.query;
  const searchString = parseValueFromQuery(search);

  const paginationRequest: PaginationRequest = {
    page: +page,
    size: +size,
    search: searchString,
  };
  console.log(paginationRequest);

  const data = await fetchAllPatients(paginationRequest);
  return res.status(HttpCode.CREATED).json(data);
};
