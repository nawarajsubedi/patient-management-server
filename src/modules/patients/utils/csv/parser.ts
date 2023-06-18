import fs from "fs";
import csv from "csv-parser";
import { getAllData, getDtos } from "./utils";
import { CSVDataRow } from "./interface";

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

  return patientData;
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
