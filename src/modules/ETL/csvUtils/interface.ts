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

export interface PatientDto {
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

export interface HospitalDto {
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_number: string;
  hospital_email: string;
}

export interface MedicationDto {
  medication_id: string;
  medication_name: string;
  medication_company: string;
  medication_level: number;
  medication_remark: string;
}

export interface NurseDto {
  nurse_id: string;
  nurse_firstname: string;
  nurse_lastname: string;
  nurse_address1: string;
  nurse_address2?: string;
  nurse_number1: string;
  nurse_checkIn?: Date;
  nurse_checkOut?: Date;
}

export interface ObservationDto {
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

export interface PractitionerDto {
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

export interface PatientInfoContainer {
  patientData: PatientDto[];
  hospitalData: HospitalDto[];
  medicationData: MedicationDto[];
  nurseData: NurseDto[];
  observationData: ObservationDto[];
  practitionerData: PractitionerDto[];
  validationErrors: CSVDataValidation[];
}

export interface CSVDataValidation {
  id: string;
  fieldName: string;
  dataValue: string;
  errorRemark: ErrorRemark;
}

export enum ErrorRemark {
  EMAIL_ERROR = "Invalid email",
  DATE_ERROR = "Invalid date",
  TIME_ERROR = "Invalid time",
  NUMBER_ERROR = "Invalid number",
}
