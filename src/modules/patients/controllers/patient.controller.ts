import { Request, Response } from "express";
import { MessageEnums, HttpCode } from "@common/exceptions/appError";

import * as patientService from "@modules/patients/services/patient.service";
import { PaginationRequest } from "../dto/pagination.request";
import { parseValueFromQuery } from "../utils/query-string";
import { DashboardReportRequest } from "../dto/dashobard.request";

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
  if (data?.data?.length === 0) {
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ message: MessageEnums.NO_RECORD_FOUND });
  }

  return res.status(HttpCode.OK).json(data);
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
  return res.status(HttpCode.OK).json(data);
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
  return res.status(HttpCode.OK).json(data);
};

/**
 * Function to handle fetch high risk patient
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const getHighRiskPatientObservation = async (
  req: Request,
  res: Response
) => {
  const data = await patientService.getHighRiskPatientObservation();
  return res.status(HttpCode.OK).json(data);
};
