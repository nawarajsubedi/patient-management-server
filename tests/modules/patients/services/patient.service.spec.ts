import {
  fetchAllPatients,
  fetchPatientDetails,
  getDashboardReport,
} from "@modules/patients/services/patient.service";
import * as patientRepository from "@modules/patients/repository/patient.repository";
import { AppError } from "@common/exceptions/appError";
import sinon from "sinon";
import { User } from "@prisma/client";
import {
  PATIENT_DATA,
  PATIENT_DETAILS,
  PATIENT_SSN,
} from "@tests/constant/patientData";
import { PaginationRequest } from "@/modules/patients/dto/pagination.request";
import { PaginationPatientResponse } from "@/modules/patients/dto/pagination.patient.response";
import { DashboardReportRequest } from "@/modules/patients/dto/dashobard.request";
import { DashboardReport } from "@/modules/patients/dto/dashboard.response";

afterEach(() => {
  sinon.restore();
});

describe("fetchAllPatients", () => {
  const paginationRequest: PaginationRequest = {
    page: 1,
    size: 10,
    search: PATIENT_SSN,
  };

  test("it should return all patients data with pagination", async () => {
    // Arrange
    const mockPatientsData: PaginationPatientResponse = {
      pagination: {
        page: 1,
        size: 10,
        total: 1,
      },
      data: [...PATIENT_DATA],
    };

    const getAllPatientsStub = sinon.stub(patientRepository, "getAllPatients");
    getAllPatientsStub.resolves(mockPatientsData);

    // Act
    const result = await fetchAllPatients(paginationRequest);

    // Assertions
    expect(getAllPatientsStub.calledOnceWith(paginationRequest)).toBe(true);
    expect(result).toEqual(mockPatientsData);
  });

  test("it should not return any result when patients data is empty", async () => {
    // Arrange
    const mockPatientsData: PaginationPatientResponse = {
      pagination: {
        page: 1,
        size: 10,
        total: 0,
      },
      data: [],
    };

    // Act
    const getAllPatientsStub = sinon.stub(patientRepository, "getAllPatients");
    getAllPatientsStub.resolves(mockPatientsData);

    const result = await fetchAllPatients(paginationRequest);

    // Assertions
    expect(getAllPatientsStub.calledOnceWith(paginationRequest)).toBe(true);
    expect(result.pagination.total).toBe(0);
    expect(result.data.length).toBe(0);
  });
});

const paginationRequest: PaginationRequest = {
  page: 1,
  size: 10,
  search: PATIENT_SSN,
};

describe("fetchPatientDetails", () => {
  test("it should fetch the patient details by ID", async () => {
    // Arrange
    const patientId = PATIENT_SSN;
    const mockPatientDetails = {
      ...PATIENT_DETAILS,
    };

    const fetchPatientDetailByIdStub = sinon.stub(
      patientRepository,
      "fetchPatientDetailById"
    );
    fetchPatientDetailByIdStub.withArgs(patientId).resolves(mockPatientDetails);

    // Act
    const result = await fetchPatientDetails(patientId);

    // Assertions
    expect(fetchPatientDetailByIdStub.calledOnceWith(patientId)).toBe(true);
    expect(result).toEqual(mockPatientDetails);
  });

  test("it should not fetch the patient details by ID if the patient not found", async () => {
    // Arrange
    const patientId = PATIENT_SSN;
    const mockPatientDetails = null;

    const fetchPatientDetailByIdStub = sinon.stub(
      patientRepository,
      "fetchPatientDetailById"
    );
    fetchPatientDetailByIdStub.withArgs(patientId).resolves(mockPatientDetails);

    // Act
    const result = await fetchPatientDetails(patientId);

    // Assertions
    expect(fetchPatientDetailByIdStub.calledOnceWith(patientId)).toBe(true);
    expect(result).toEqual(mockPatientDetails);
  });
});

describe("getDashboardReport", () => {
  const request: DashboardReportRequest = {
    startDate: "2023-01-01",
    endDate: "2023-01-31",
  };

  test("it should return the dashboard report data", async () => {
    // Arrange
    const mockedData: DashboardReport = {
      nurseCount: 10,
      observationCount: 10,
      patientCount: 20,
      practitionerCount: 5,
      medicationByPatient: {
        counts: [1, 2],
        names: ["test med 1", "test med 2"],
      },
    } as DashboardReport;

    const getTotalPatientsDetailsStub = sinon.stub(
      patientRepository,
      "getDashboardReport"
    );
    getTotalPatientsDetailsStub.withArgs(request).resolves(mockedData);

    // Act
    const result = await getDashboardReport(request);

    // Assertions
    expect(getTotalPatientsDetailsStub.calledOnceWith(request)).toBe(true);
    expect(result).toEqual(mockedData);
  });

  test("it should not return the dashboard report data if data not available", async () => {
    // Arrange
    const mockedData: DashboardReport = null;

    const getTotalPatientsDetailsStub = sinon.stub(
      patientRepository,
      "getDashboardReport"
    );
    getTotalPatientsDetailsStub.withArgs(request).resolves(mockedData);

    // Act
    const result = await getDashboardReport(request);

    // Assertions
    expect(getTotalPatientsDetailsStub.calledOnceWith(request)).toBe(true);
    expect(result).toEqual(mockedData);
  });
});
