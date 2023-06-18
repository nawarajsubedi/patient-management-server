import { Sex } from "./enum";

export interface CSVDataRow {
  observation_id: string;
  observation_date: string;
  observation_time: string;
  observation_remark: string;
  patient_ssn: string;
  patient_firstName: string;
  patient_lastName: string;
  patient_country: string;
  patient_address1: string;
  patient_address2: string;
  patient_number1: string;
  patient_number2: string;
  patient_sex: Sex;
  patient_DOB: string;
  patient_DOD: string;
  patient_email: string;
  patient_height: string;
  patient_weight: string;
  patient_bloodType: string;
  patient_educationBackground: string;
  patient_occupation: string;
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_number: string;
  hospital_email: string;
  practitioner_id: string;
  practitioner_firstName: string;
  practitioner_lastName: string;
  practitioner_address1: string;
  practitioner_address2: string;
  practitioner_number1: string;
  practitioner_number2: string;
  practitioner_checkIn: string;
  practitioner_checkOut: string;
  nurse_id: string;
  nurse_firstName: string;
  nurse_lastName: string;
  nurse_address1: string;
  nurse_address2: string;
  nurse_number1: string;
  nurse_checkIn: string;
  nurse_checkOut: string;
  medication_id: string;
  medication_name: string;
  medication_company: string;
  medication_level: string;
  medication_remark: string;
}

export class PatientDTO {
  patient_ssn: string;
  patient_firstname: string;
  patient_lastname: string;
  patient_country: string;
  patient_address1: string;
  patient_address2: string;
  patient_number1: string;
  patient_number2: string;
  patient_sex: Sex;
  patient_dob?: Date;
  patient_dod?: Date;
  patient_email: string;
  patient_height: number;
  patient_weight: number;
  patient_bloodtype: string;
  patient_education_background: string;
  patient_occupation: string;
}

export class HospitalDTO {
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_number: string;
  hospital_email: string;
}

export class MedicationDTO {
  medication_id: string;
  medication_name: string;
  medication_company: string;
  medication_level: string;
  medication_remark: string;
}

export class NurseDto {
  nurse_id: string;
  nurse_firstname: string;
  nurse_lastname: string;
  nurse_address1: string;
  nurse_address2?: string;
  nurse_number1: string;
  nurse_checkIn?: Date;
  nurse_checkOut?: Date;
}

export class ObservationDTO {
  observation_id: string;
  observation_date?: Date;
  observation_time?: Date;
  observation_remark: string;
  patient_ssn: string;
  practitioner_id: string;
  hospital_id: string;
  medication_id: string;
  nurse_id: string;
}

export class PractitionerDto {
  practitioner_id: string;
  practitioner_firstname: string;
  practitioner_lastname: string;
  practitioner_address1?: string;
  practitioner_address2?: string;
  practitioner_number1?: string;
  practitioner_number2?: string;
  practitioner_checkin?: Date;
  practitioner_checkout?: Date;
}

export interface PatientDataWrapper {
  patientData: PatientDTO[];
  hospitalData: HospitalDTO[];
  medicationData: MedicationDTO[];
  nurseData: NurseDto[];
  ObservationData: ObservationDTO[];
  practitionerData: PractitionerDto[];
}

// observation_id String  @id
// observation_date DateTime?
// observation_time DateTime?
// observation_remark String
// patient Patient @relation(fields: [patient_ssn], references: [patient_ssn])
// patient_ssn String
// practitioner Practitioner @relation(fields: [practitioner_id], references: [practitioner_id])
// practitioner_id String
// nurse Nurse @relation(fields: [nurse_id], references: [nurse_id])
// nurse_id String
// medication Medication @relation(fields: [medication_id], references: [medication_id])
// medication_id String
// hospital Hospital @relation(fields: [hospital_id], references: [hospital_id])
// hospital_id String
