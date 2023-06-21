import { AppError, HttpCode } from "@common/exceptions/appError";
import * as patientRepository from "../repository/patient.repository";
import { PatientInfoContainer } from "../csvUtils/interface";
import { PaginationRequest } from "../dto/pagination.request";
import { DashboardReportRequest } from "../dto/dashobard.request";

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const updateCSVData = async (data: PatientInfoContainer) => {
  const res = await patientRepository.insertOrUpdatePatientData(data);
  return res;
};

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const fetchAllPatients = async (
  paginationRequest: PaginationRequest
) => {
  return await patientRepository.getAllPatients(paginationRequest);
};

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const fetchPatientDetails = async (id: string) => {
  const patientDetails = await patientRepository.fetchPatientDetailById(id);
  return patientDetails;
};

/**
 * Service for dashboard report
 *
 * @param payload
 * @returns {object}
 */
export const getDashboardReport = async (request: DashboardReportRequest) => {
  console.log("date", request);
  const totalPatients = patientRepository.getTotalPatientsDetails(request);
  // const dashboardDetails = await getDashboardReport(request);
  return null;
};
