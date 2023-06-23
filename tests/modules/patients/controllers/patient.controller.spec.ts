import { Request, Response } from "express";
import {
  getDashboardReport,
  getPatientDetails,
  getAllPatients,
} from "@modules/patients/controllers/patient.controller";
import * as patientService from "@modules/patients/services/patient.service";
import { HttpCode, MessageEnums } from "@/common/exceptions/appError";
import { DashboardReport } from "@/modules/patients/dto/dashboard.response";
import { Patient } from "@prisma/client";
import { PaginationRequest } from "@/modules/patients/dto/pagination.request";
import { PATIENT_DATA, PATIENT_SSN } from "@tests/constant/patientData";
import { PaginationPatientResponse } from "@/modules/patients/dto/pagination.patient.response";
import { CustomRequest } from "@tests/common/interfaces/CustomRequest";

jest.mock("@modules/patients/services/patient.service", () => ({
  getDashboardReport: jest.fn(),
  fetchPatientDetails: jest.fn(),
  fetchAllPatients: jest.fn(),
}));

describe("getDashboardReport", () => {
  let req: Partial<Request> = {};
  let mockReq: CustomRequest;
  let mockRes: Response;

  beforeEach(() => {
    mockReq = {
      query: {
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      },
    } as unknown as CustomRequest;
    req = {} as Request;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
  });

  it("should fetch the dashboard report and return a response with status 200", async () => {
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
    (patientService.getDashboardReport as jest.Mock).mockResolvedValue(
      mockedData
    );

    await getDashboardReport(mockReq, mockRes);

    expect(patientService.getDashboardReport).toHaveBeenCalledWith({
      startDate: "2023-01-01",
      endDate: "2023-01-31",
    });
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.OK);
    expect(mockRes.json).toHaveBeenCalledWith(mockedData);
  });
});

describe("getPatientDetails", () => {
  const patient_ssn = "106-27-1722";
  const mockReq: Partial<Request> = {
    params: { id: patient_ssn },
  };

  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should fetch patient details and return a response with status 200", async () => {
    const mockPatientDetails: Patient = {
      patient_ssn,
      patient_firstname: "Barry",
      patient_lastname: "Gibberd",
      patient_country: "Philippines",
      patient_address1: "1 Old Shore Way",
      patient_address2: "Room 1090",
      patient_number1: "263-634-6572",
      patient_number2: "827-584-6788",
      patient_sex: "F",
      patient_dob: new Date("1990-02-23T18:15:00.000Z"),
      patient_dod: new Date("2026-05-01T18:15:00.000Z"),
      patient_email: "bgibberd7@techcrunch.com",
      patient_height: 5.1,
      patient_weight: 112,
      patient_bloodtype: "B-",
      patient_education_background: "Bachelors",
      patient_occupation: "Retired",
      createdAt: new Date("2023-06-19T02:47:10.036Z"),
    };
    (patientService.fetchPatientDetails as jest.Mock).mockResolvedValue(
      mockPatientDetails
    );

    await getPatientDetails(mockReq as Request, mockRes as Response);

    expect(patientService.fetchPatientDetails).toHaveBeenCalledWith(
      patient_ssn
    );
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.OK);
    expect(mockRes.json).toHaveBeenCalledWith(mockPatientDetails);
  });
});

describe("getAllPatients", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      query: {
        page: "1",
        size: "10",
        search: PATIENT_SSN,
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all patients and return a response with status 200", async () => {
    const paginationRequest: PaginationRequest = {
      page: 1,
      size: 10,
      search: PATIENT_SSN,
    };

    const mockPatientsData: Patient[] = [...PATIENT_DATA];

    (patientService.fetchAllPatients as jest.Mock).mockResolvedValue(
      mockPatientsData
    );

    await getAllPatients(mockReq as Request, mockRes as Response);

    expect(patientService.fetchAllPatients).toHaveBeenCalledWith(
      paginationRequest
    );
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.OK);
    expect(mockRes.json).toHaveBeenCalledWith(mockPatientsData);
  });

  it("should not fetch patients and return a response with status 404", async () => {
    const paginationRequest: PaginationRequest = {
      page: 1,
      size: 10,
      search: PATIENT_SSN,
    };

    const mockPatientsData: PaginationPatientResponse = {
      data: [],
      pagination: {
        page: 1,
        size: 10,
        total: 0,
      },
    };

    (patientService.fetchAllPatients as jest.Mock).mockResolvedValue(
      mockPatientsData
    );

    await getAllPatients(mockReq as Request, mockRes as Response);

    expect(patientService.fetchAllPatients).toHaveBeenCalledWith(
      paginationRequest
    );
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: MessageEnums.NO_RECORD_FOUND,
    });
  });
});
