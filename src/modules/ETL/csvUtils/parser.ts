import fs from "fs";
import csv from "csv-parser";
import { getAllData } from "./utils";
import { CSVDataRow } from "./interface";

export const parseCSVFile = async (filePath: string) => {
  const data = await readCSVData(filePath);
  const patientData = getAllData(data);
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
