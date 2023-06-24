import { Sex } from "@/modules/ETL/csvUtils/enum";
import { PatientDetails } from "@/modules/patients/dto/patient.details";
import { Patient } from "@prisma/client";

const PATIENT_SSN = "123-88-3607";

const PATIENT_DATA: Patient[] = [
  {
    patient_ssn: PATIENT_SSN,
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

const PATIENT_DETAILS: PatientDetails = {
  patient: { ...PATIENT_DATA[0] },
  observations: [
    {
      observationId: "0aea9aa7-d790-41fc-80c5-653d96ce47ea",
      patientSsn: PATIENT_SSN,
      observationDate: new Date("2024-05-01T18:15:00.000Z"),
      medicationName: "Red Cedar",
      medicationId: "e9393534-50b5-4dad-9793-94b77822d172",
      medicationLevel: 4,
    },
  ],
};

export { PATIENT_SSN, PATIENT_DATA, PATIENT_DETAILS };
