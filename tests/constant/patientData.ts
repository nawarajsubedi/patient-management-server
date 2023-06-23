import { Sex } from "@/modules/ETL/csvUtils/enum";
import { Patient } from "@prisma/client";

const PATIENT_SSN = "123-88-3607";

const PATIENT_DATA: Patient[] = [
  {
    patient_ssn: "173-56-7224",
    patient_firstname: "Barry",
    patient_lastname: "Gibberd",
    patient_country: "Philippines",
    patient_address1: "1 Old Shore Way",
    patient_address2: "Room 1090",
    patient_number1: "263-634-6572",
    patient_number2: "827-584-6788",
    patient_sex: Sex.M,
    patient_dob: new Date("1990-02-23T18:15:00.000Z"),
    patient_dod: new Date("2026-05-01T18:15:00.000Z"),
    patient_email: "bgibberd7@techcrunch.com",
    patient_height: 5.1,
    patient_weight: 112,
    patient_bloodtype: "B-",
    patient_education_background: "Bachelors",
    patient_occupation: "Retired",
    createdAt: new Date("2024-05-01T18:15:00.000Z"),
  },
];

export { PATIENT_SSN, PATIENT_DATA };
