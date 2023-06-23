import * as patientRepository from "../repository/patient.repository";
import { PaginationRequest } from "../dto/pagination.request";
import { DashboardReportRequest } from "../dto/dashobard.request";

/**
 * Service for handling fetchAllPatients
 *
 * @param payload PaginationRequest
 * @returns {object}
 */
export const fetchAllPatients = async (
  paginationRequest: PaginationRequest
) => {
  return await patientRepository.getAllPatients(paginationRequest);
};

/**
 * Service for handling fetchPatientDetails
 *
 * @param payload id
 * @returns {object}
 */
export const fetchPatientDetails = async (id: string) => {
  const patientDetails = await patientRepository.fetchPatientDetailById(id);
  return patientDetails;
};

/**
 * Service for dashboard report
 *
 * @param payload DashboardReportRequest
 * @returns {object}
 */
export const getDashboardReport = async (request: DashboardReportRequest) => {
  return await patientRepository.getTotalPatientsDetails(request);
};
