import { AppError, HttpCode } from "@common/exceptions/appError";
import {
  insertOrUpdatePatientData,
  getAllPatients,
  fetchPatientDetailById,
} from "../repository/patient.repository";
import { PatientInfoContainer } from "../csvUtils/interface";
import { PaginationRequest } from "../dto/pagination.request";

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const updateCSVData = async (data: PatientInfoContainer) => {
  const res = await insertOrUpdatePatientData(data);
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
  return await getAllPatients(paginationRequest);
};

/**
 * Service for handling user sign up
 *
 * @param payload Prisma.UserCreateInput
 * @returns {object}
 */
export const fetchPatientDetails = async (id: string) => {
  const patientDetails = await fetchPatientDetailById(id);
  return patientDetails;
};
