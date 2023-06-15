import { Request, Response } from "express";
import multer from "multer";
import { parse } from "csv-parse";
import { Result } from "@common/core/Result";
import { HttpCode } from "@common/exceptions/appError";

import { parseAndUploadFile } from "@modules/patients/services/patient.service";
import { getDtos } from "../csv-parser";
import { promisify } from "util";
// import { files } from "../middlewares/file-upload";
const parseCSV = promisify(parse);

const upload = multer({ dest: "tmp/csv/" });
// interface RequestWithFile extends Request {
//   file: Express.Multer.File; // Define the 'file' property of type 'Express.Multer.File'
// }
/**
 * Function to handle user signup
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<Response>}
 */
export const uploadCSVFile = async (req: Request, res: Response) => {
  // const upload = multer({
  //   storage: files.storage(),
  //   allowedFile: files.allowedFile,
  // }).single("file");

  // console.log("file upload service", req);

  console.log("upload api", req.file);

  const result = await parse(
    req.file.buffer,
    { columns: true },
    async (err, rows) => {
      // try {
      if (err) {
        // this.logger.error(err);
        return err;
      }

      for await (const row of rows) {
        const res = getDtos(row);

        const { id, dtos } = res;

        const {
          currentSSN,
          currentHospitalId,
          currentMedicationId,
          currentNurseId,
          currentPractitionerId,
        } = id;

        const {
          patientDTO,
          nurseDTO,
          observationDTO,
          practitionerDTO,
          hospitalDTO,
          medicationDTO,
        } = dtos;
      }
    }
  );

  const data = await parseAndUploadFile(req.body);
  // const responseData = Result.ok(data);
  return res.status(HttpCode.CREATED).json({ data: "success" });
};

// const csv = require("fast-csv");
// router.get("/", async (req, res, next) => {
//   // console.log(req.token);
//   try {
//     const data = await fs.readFile("patients.json", "utf8");
//     const patientList = JSON.parse(data);
//     res.json({ patients: patientList });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/upload-csv", upload.single("file"), async (req, res, next) => {
//   console.log("upload api", req.file.path);

const handleCSVUpload = async (req: Request) => {
  try {
    await upload(req, null, async (err) => {
      if (err) {
        throw err;
      }

      if (!req.file) {
        throw new Error("No file found in request");
      }

      const { buffer } = req.file;

      const options = { columns: true };

      const rows = await parseCSV(buffer.toString(), options);

      for await (const row of rows) {
        const res = getDtos(row);

        const { id, dtos } = res;

        const {
          currentSSN,
          currentHospitalId,
          currentMedicationId,
          currentNurseId,
          currentPractitionerId,
        } = id;

        const {
          patientDTO,
          nurseDTO,
          observationDTO,
          practitionerDTO,
          hospitalDTO,
          medicationDTO,
        } = dtos;

        // Process the data further as needed
      }
    });
  } catch (err) {
    // Handle any errors that occurred during the upload or parsing
    console.error(err);
  }
};
