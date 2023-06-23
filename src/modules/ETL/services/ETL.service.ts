import * as patientRepository from "../repository/ETL.repository";
import { PatientInfoContainer } from "../csvUtils/interface";

/**
 * Service for handling csv data upload
 *
 * @param payload CSV data
 * @returns {object}
 */
export const updateObservationData = async (data: PatientInfoContainer) => {
  return await patientRepository.updateObservationData(data);
};
