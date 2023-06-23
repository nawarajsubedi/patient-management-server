import { Request, Response } from "express";
import { uploadCSVFile } from "@modules/ETL/controllers/ETL.controller";
import * as ETLService from "@modules/ETL/services/ETL.service";
import * as csvFileService from "@modules/ETL/csvUtils/parser";
import { HttpCode } from "@/common/exceptions/appError";
import { PatientInfoContainer } from "@/modules/ETL/csvUtils/interface";
import { observationData } from "@tests/constant/observationData";

jest.mock("@modules/ETL/services/ETL.service", () => ({
  updateObservationData: jest.fn(),
}));

jest.mock("@modules/ETL/csvUtils/parser", () => ({
  parseCSVFile: jest.fn(),
}));

describe("uploadCSVFile", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let parseCSVFile: jest.Mock<any, any> | any;
  let updateObservationData: jest.Mock<any, any> | any;
  const patient_ssn = "106-27-1722";

  beforeEach(() => {
    req = {
      file: {
        path: "test/file.csv",
      },
    } as unknown as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    parseCSVFile = jest.spyOn(csvFileService, "parseCSVFile");
    updateObservationData = jest.spyOn(ETLService, "updateObservationData");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should upload and process the CSV file successfully", async () => {
    const response: PatientInfoContainer = observationData;
    parseCSVFile.mockResolvedValue(response);
    updateObservationData.mockResolvedValue(response);

    await uploadCSVFile(req as Request, res as Response);

    expect(parseCSVFile).toHaveBeenCalledWith(req.file.path);
    expect(updateObservationData).toHaveBeenCalledWith(response);
    expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED);
    expect(res.json).toHaveBeenCalledWith(response);
  });

  it("should handle error while parsing the CSV file", async () => {
    const error = new Error("CSV parsing error");
    parseCSVFile.mockRejectedValue(error);

    await uploadCSVFile(req as Request, res as Response);

    expect(parseCSVFile).toHaveBeenCalledWith(req.file.path);
    expect(updateObservationData).not.toHaveBeenCalled();
  });
});
