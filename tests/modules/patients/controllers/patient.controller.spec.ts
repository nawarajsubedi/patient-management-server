import { Request, Response } from "express";
import {
  getDashboardReport,
  getPatientDetails,
} from "@modules/patients/controllers/patient.controller";
import * as patientService from "@modules/patients/services/patient.service";
import { HttpCode } from "@/common/exceptions/appError";
import { DashboardReport } from "@/modules/patients/dto/dashboard.response";

export interface CustomRequest extends Request {
  query: Record<string, any>;
}

jest.mock("@modules/patients/services/patient.service", () => ({
  getDashboardReport: jest.fn(),
  fetchPatientDetails: jest.fn(),
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

  // it("should handle errors and return a response with status 500", async () => {
  //   const errorMessage = "Internal server error";
  //   (patientService.getDashboardReport as jest.Mock).mockRejectedValue(
  //     new Error(errorMessage)
  //   );

  //   try {
  //     await getDashboardReport(mockReq as Request, mockRes as Response);
  //   } catch (error) {
  //     expect(error.message).toBe(errorMessage);
  //   }

  //   expect(patientService.getDashboardReport).toHaveBeenCalledWith({
  //     startDate: "2023-01-01",
  //     endDate: "2023-01-31",
  //   });
  //   expect(mockRes.status).toHaveBeenCalledWith(expect.any(Function));
  //   expect(mockRes.status).toHaveBeenCalledWith(500);
  //   expect(mockRes.json).toHaveBeenCalledWith({
  //     error: { message: errorMessage },
  //   });
  // });
});

describe("getPatientDetails", () => {
  const mockReq: Partial<Request> = {
    params: { id: "123" },
  };

  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should fetch patient details and return a response with status 200", async () => {
    const mockPatientDetails = { id: "123", name: "John Doe" };
    (patientService.fetchPatientDetails as jest.Mock).mockResolvedValue(
      mockPatientDetails
    );

    await getPatientDetails(mockReq as Request, mockRes as Response);

    expect(patientService.fetchPatientDetails).toHaveBeenCalledWith("123");
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.OK);
    expect(mockRes.json).toHaveBeenCalledWith(mockPatientDetails);
  });

  // it("should handle errors and return a response with status 500", async () => {
  //   const errorMessage = "Internal server error";
  //   (patientService.fetchPatientDetails as jest.Mock).mockRejectedValue(
  //     new Error(errorMessage)
  //   );

  //   await getPatientDetails(mockReq as Request, mockRes as Response);

  //   expect(patientService.fetchPatientDetails).toHaveBeenCalledWith("123");
  //   expect(mockRes.status).toHaveBeenCalledWith(HttpCode.INTERNAL_SERVER_ERROR);
  //   expect(mockRes.json).toHaveBeenCalledWith({
  //     error: { message: errorMessage },
  //   });
  // });
});
