import { Request, Response } from "express";
import { Result } from "@common/core/Result";
import { HttpCode } from "@common/exceptions/appError";

import * as patientService from "@modules/patients/services/patient.service";
import { parseCSVFile } from "../csvUtils/parser";
import { PatientInfoContainer } from "../csvUtils/interface";
import { PaginationRequest } from "../dto/pagination.request";
import { parseValueFromQuery } from "../utils/query-string";
import { DashboardReportRequest } from "../dto/dashobard.request";

/**
 * Function to handle CSV file upload
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

  const data = await patientService.updateCSVData(response);
  return res.status(HttpCode.CREATED).json(data);
};

/**
 * Function to handle fetch all patients
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

  const data = await patientService.fetchAllPatients(paginationRequest);
  return res.status(HttpCode.CREATED).json(data);
};

/**
 * Function to handle fetch patient details
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const getPatientDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await patientService.fetchPatientDetails(id);
  return res.status(HttpCode.CREATED).json(data);
};

/**
 * Function to handle fetch dashboard report
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const getDashboardReport = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const startDateStr = parseValueFromQuery(startDate);
  const endDateStr = parseValueFromQuery(endDate);

  const request: DashboardReportRequest = {
    startDate: startDateStr,
    endDate: endDateStr,
  };

  const data = await patientService.getDashboardReport(request);
  return res.status(HttpCode.CREATED).json(data);
};
