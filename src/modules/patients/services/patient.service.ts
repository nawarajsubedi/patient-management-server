import { AppError, HttpCode } from "@common/exceptions/appError";
import { insertOrUpdatePatientData } from "../repository/patient.repository";
import { PatientInfoContainer } from "../csvUtils/interface";

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
