import * as patientRepository from "@modules/ETL/repository/ETL.repository";
import { updateObservationData } from "@modules/ETL/services/ETL.service";

import { PatientInfoContainer } from "@modules/ETL/csvUtils/interface";
import { PatientObservationData } from "@tests/constant/observationData";

jest.mock("@modules/ETL/repository/ETL.repository");

describe("updateObservationData", () => {
  it("should update observation data and return true", async () => {
    const {
      hospitalData,
      medicationData,
      nurseData,
      observationData,
      patientData,
      practitionerData,
    } = PatientObservationData;

    const mockData: PatientInfoContainer = {
      patientData: [...patientData],
      hospitalData: [...hospitalData],
      nurseData: [...nurseData],
      practitionerData: [...practitionerData],
      medicationData: [...medicationData],
      observationData: [...observationData],
    };

    await updateObservationData(mockData);

    expect(patientRepository.updateObservationData).toHaveBeenCalledWith(
      mockData
    );
    expect(patientRepository.updateObservationData).toHaveBeenCalledTimes(1);
  });
});
