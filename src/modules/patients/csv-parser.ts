import fs from "fs";
import csv from "csv-parser";
import { getAllData, getDtos } from "./utils/csv/csvUtils";
import { CSVDataRow } from "./utils/csv/interface";

export const parseCSVFile = async (filePath: string) => {
  const data = await readCSVData(filePath);
  const patientData = getAllData(data);
  let tempData = [];

  for (const row of data) {
    const res = getDtos(row);
    console.log("here data");

    const { id, dtos } = res;
    tempData.push({ id, dtos });
  }

  //   console.log(
  //     "ssn",
  //     data.map((row) => row.patient_ssn)
  //   );

  return tempData;
};

const readCSVData = async (filePath: string): Promise<CSVDataRow[]> => {
  return new Promise((resolve, reject) => {
    const data: CSVDataRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("error", (error) => reject(error))
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data));
  });
};

// const result = await parse(
//   req.file.buffer,
//   { columns: true },
//   async (err, rows) => {
//     // try {
//     if (err) {
//       // this.logger.error(err);
//       return err;
//     }

//     for await (const row of rows) {
//       const res = getDtos(row);

//       const { id, dtos } = res;

//       const {
//         currentSSN,
//         currentHospitalId,
//         currentMedicationId,
//         currentNurseId,
//         currentPractitionerId,
//       } = id;

//       const {
//         patientDTO,
//         nurseDTO,
//         observationDTO,
//         practitionerDTO,
//         hospitalDTO,
//         medicationDTO,
//       } = dtos;
//     }
//   }
// );
