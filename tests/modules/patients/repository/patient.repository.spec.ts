import { prismaMock } from "@tests/prismaTestSetup";
import {
  getDashboardReport,
  fetchPatientDetailById,
  getAllPatients,
  getPatientsByObservationDate,
  getPatientByMedication,
} from "@modules/patients/repository/patient.repository";
import * as patientRepository from "@modules/patients/repository/patient.repository";
import { PATIENT_DATA, PATIENT_SSN } from "@tests/constant/patientData";
import { Medication, Observation, Patient } from "@prisma/client";
import { BarChartData } from "@/modules/patients/dto/dashboard.response";
import { PaginationRequest } from "@/modules/patients/dto/pagination.request";

afterEach(() => {
  jest.clearAllMocks();
});

describe("getTotalPatientsDetails", () => {
  const startDate = "2023-01-01";
  const endDate = "2023-01-31";

  const mockReportData = {
    patientCount: 100,
    practitionerCount: 50,
    nurseCount: 20,
    observationCount: 200,
  };

  const barChartData: BarChartData = {
    counts: [1, 2],
    names: ["test data 1", "test data 2"],
  } as BarChartData;

  const patientByObservation = [
    {
      ...PATIENT_DATA[0],
      observation: [
        {
          observation_id: "276ed914-9422-4fe3-8471-9f2855ec6421",
          observation_date: new Date("2042-10-17T18:15:00.000Z"),
          observation_time: new Date("2042-10-18T12:59:00.000Z"),
          observation_remark:
            "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
          patient_ssn: "106-27-1722",
          practitioner_id: "0557b11d-4038-42f3-b2a2-c1b11c450280",
          nurse_id: "3d45eb7a-4953-48af-9ad5-675583aac9b0",
          medication_id: "4faa81ac-5399-4254-96ee-e2c6630fb481",
          hospital_id: "01GR8W6HWN9H3RWVWGJ9BEEBCB",
          medication: {
            medication_id: "4faa81ac-5399-4254-96ee-e2c6630fb481",
            medication_name: "Aluminum Zirconium Tetrachlorohydrex GLY",
            medication_company: "Lebsack-Heaney",
            medication_level: 6.3,
            medication_remark:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
          },
        },
      ],
    },
  ];

  test("it should return the dashboard report data", async () => {
    // Arrange
    const getPatientsByObservationDateSpy = jest.spyOn(
      patientRepository,
      "getPatientsByObservationDate"
    );

    const getPatientByMedicationSpy = jest.spyOn(
      patientRepository,
      "getPatientByMedication"
    );

    const getPatientByNurseSpy = jest.spyOn(
      patientRepository,
      "getPatientByNurse"
    );

    const getPatientByPractitionerSpy = jest.spyOn(
      patientRepository,
      "getPatientByPractitioner"
    );

    const getCountResultSpy = jest.spyOn(patientRepository, "getCountResult");

    getPatientsByObservationDateSpy.mockResolvedValue(patientByObservation);

    getPatientByMedicationSpy.mockResolvedValue(barChartData);
    getPatientByNurseSpy.mockResolvedValue(barChartData);
    getPatientByPractitionerSpy.mockResolvedValue(barChartData);
    getCountResultSpy.mockResolvedValue(mockReportData);

    // Act
    const result = await getDashboardReport({ startDate, endDate });

    // Assertions
    expect(patientRepository.getPatientsByObservationDate).toHaveBeenCalledWith(
      startDate,
      endDate
    );
    expect(patientRepository.getPatientByMedication).toHaveBeenCalledWith(
      startDate,
      endDate
    );
    expect(patientRepository.getPatientByNurse).toHaveBeenCalledWith(
      startDate,
      endDate
    );
    expect(patientRepository.getPatientByPractitioner).toHaveBeenCalledWith(
      startDate,
      endDate
    );
    expect(patientRepository.getCountResult).toHaveBeenCalledWith(
      startDate,
      endDate
    );
    expect(result).toEqual(expect.objectContaining(mockReportData));
  });
});

describe("fetchPatientDetailById", () => {
  const patientByObservation = [
    {
      ...PATIENT_DATA[0],
      observation_id: "276ed914-9422-4fe3-8471-9f2855ec6421",
      observation_date: new Date("2042-10-17T18:15:00.000Z"),
      observation_time: new Date("2042-10-18T12:59:00.000Z"),
      observation_remark:
        "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
      patient_ssn: "106-27-1722",
      practitioner_id: "0557b11d-4038-42f3-b2a2-c1b11c450280",
      nurse_id: "3d45eb7a-4953-48af-9ad5-675583aac9b0",
      medication_id: "4faa81ac-5399-4254-96ee-e2c6630fb481",
      hospital_id: "01GR8W6HWN9H3RWVWGJ9BEEBCB",
      medication: {
        medication_id: "4faa81ac-5399-4254-96ee-e2c6630fb481",
        medication_name: "Aluminum Zirconium Tetrachlorohydrex GLY",
        medication_company: "Lebsack-Heaney",
        medication_level: 6.3,
        medication_remark:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
      },
    },
  ] as unknown as (Observation & {
    medication: Medication;
  })[];

  const patient = { ...PATIENT_DATA[0] };

  //@ts-ignore
  const findPatientUnique = prismaMock.patient.findUnique;
  //@ts-ignore
  const findObservationMany = prismaMock.observation.findMany;
  //@ts-ignore
  const mockTransaction = prismaMock.$transaction;

  test("it should return the dashboard report data", async () => {
    const patientId = PATIENT_SSN;

    findPatientUnique.mockResolvedValue(patient);
    findObservationMany.mockResolvedValue(patientByObservation);

    //@ts-ignore
    mockTransaction.mockImplementation((callback) => callback(prismaMock));

    // Act
    await fetchPatientDetailById(patientId);

    // Assertions
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(findPatientUnique).toHaveBeenCalledTimes(1);
    expect(findObservationMany).toHaveBeenCalledTimes(1);
  });
});

describe("getAllPatients", () => {
  const patients = [
    {
      ...PATIENT_DATA[0],
    },
  ] as Patient[];

  const patient = { ...PATIENT_DATA[0] };

  //@ts-ignore
  const findPatientMany = prismaMock.patient.findMany;
  //@ts-ignore
  const patientCount = prismaMock.patient.count;
  //@ts-ignore
  const mockTransaction = prismaMock.$transaction;

  test("it should return the dashboard report data", async () => {
    // Arrange
    const paginationRequest: PaginationRequest = {
      page: 1,
      size: 10,
      search: PATIENT_SSN,
    };

    findPatientMany.mockResolvedValue(patients);
    patientCount.mockResolvedValue(10);
    mockTransaction.mockImplementation((callback) => callback(prismaMock));

    // Act
    await getAllPatients(paginationRequest);

    // Assertions
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(findPatientMany).toHaveBeenCalledTimes(1);
    expect(patientCount).toHaveBeenCalledTimes(1);
  });
});

describe("getPatientsByObservationDate", () => {
  const startDate = "2023-01-01";
  const endDate = "2023-01-31";

  const patientByObservation = [
    {
      ...PATIENT_DATA[0],
      observation: [
        {
          observation_id: "276ed914-9422-4fe3-8471-9f2855ec6421",
          observation_date: new Date("2042-10-17T18:15:00.000Z"),
          observation_time: new Date("2042-10-18T12:59:00.000Z"),
          observation_remark:
            "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
          patient_ssn: "106-27-1722",
          practitioner_id: "0557b11d-4038-42f3-b2a2-c1b11c450280",
          nurse_id: "3d45eb7a-4953-48af-9ad5-675583aac9b0",
          medication_id: "4faa81ac-5399-4254-96ee-e2c6630fb481",
          hospital_id: "01GR8W6HWN9H3RWVWGJ9BEEBCB",
          medication: {
            medication_id: "4faa81ac-5399-4254-96ee-e2c6630fb481",
            medication_name: "Aluminum Zirconium Tetrachlorohydrex GLY",
            medication_company: "Lebsack-Heaney",
            medication_level: 6.3,
            medication_remark:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
          },
        },
      ],
    },
  ] as unknown as (Patient & {
    observation: (Observation & {
      medication: Medication;
    })[];
  })[];

  //@ts-ignore
  const findPatientMany = prismaMock.patient.findMany;

  test("should retrieve patients with observations within the specified date range", async () => {
    // Arrange
    findPatientMany.mockResolvedValue(patientByObservation);

    // Act
    const result = await getPatientsByObservationDate(startDate, endDate);

    // Assertions
    expect(result).toEqual(patientByObservation);
  });
});

describe("getPatientByMedication", () => {
  //@ts-ignore
  const findPatientByMedication = prismaMock.$queryRaw;

  test("should get patients with observations within the specified date range", async () => {
    // Arrange
    const startDate = "2023-01-01";
    const endDate = "2023-01-31";

    const mockQueryResult = [
      {
        fullname: "test data 1",
        count: "1",
      },
      {
        fullname: "test data 2",
        count: "2",
      },
    ];

    findPatientByMedication.mockResolvedValue(mockQueryResult);

    // const expectedBarChartData = {
    //   names: ["Medication A", "Medication B"],
    //   ids: ["1", "2"],
    //   counts: [10, 5],
    // };

    const barChartData: BarChartData = {
      counts: [1, 2],
      names: ["test data 1", "test data 2"],
    } as BarChartData;

    // Act
    const result = await getPatientByMedication(startDate, endDate);

    // Assertions
    expect(result).toEqual(barChartData);
  });
});
