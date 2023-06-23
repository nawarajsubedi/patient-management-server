import { prismaMock } from "@tests/prismaTestSetup";
import { PatientObservationData } from "@tests/constant/observationData";
import { PatientInfoContainer } from "@/modules/ETL/csvUtils/interface";
import { updateObservationData } from "@/modules/ETL/repository/ETL.repository";

describe("updateObservationData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  //@ts-ignore
  const createPatientMany = prismaMock.patient.createMany;
  //@ts-ignore
  const createNurseMany = prismaMock.nurse.createMany;
  //@ts-ignore
  const createPractitionerMany = prismaMock.practitioner.createMany;
  //@ts-ignore
  const createObservationMany = prismaMock.observation.createMany;
  //@ts-ignore
  const createMedicationMany = prismaMock.hospital.createMany;
  //@ts-ignore
  const createHospitalMany = prismaMock.medication.createMany;
  //@ts-ignore
  const mockTransaction = prismaMock.$transaction;

  test("it should update observation data using a transaction", async () => {
    createPatientMany.mockResolvedValue({ count: 1 });
    createNurseMany.mockResolvedValue({ count: 1 });
    createPractitionerMany.mockResolvedValue({ count: 1 });
    createObservationMany.mockResolvedValue({ count: 1 });
    createMedicationMany.mockResolvedValue({ count: 1 });
    createPatientMany.mockResolvedValue({ count: 1 });
    createHospitalMany.mockResolvedValue({ count: 1 });

    mockTransaction.mockImplementation((callback) => callback(prismaMock));

    const result = await updateObservationData(mockData);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(createPatientMany).toHaveBeenCalledTimes(1);
    expect(createNurseMany).toHaveBeenCalledTimes(1);
    expect(createPractitionerMany).toHaveBeenCalledTimes(1);
    expect(createObservationMany).toHaveBeenCalledTimes(1);
    expect(createMedicationMany).toHaveBeenCalledTimes(1);
    expect(createPatientMany).toHaveBeenCalledTimes(1);
    expect(createHospitalMany).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(true);
  });
});
