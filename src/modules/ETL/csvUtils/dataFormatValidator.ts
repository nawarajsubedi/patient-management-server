import {
  validateDate,
  validateTime,
} from "../../../common/validators/dateValidator";
import { validateEmailFormat } from "../../../common/validators/emailValidator";
import { CSVDataRow, CSVDataValidation, ErrorRemark } from "./interface";
import { isNumber } from "../../../common/validators/numberValidator";

export const validatePatient = (row: CSVDataRow) => {
  let validations: CSVDataValidation[] = [];
  const isEmailValid = validateEmailFormat(row.patient_email);
  const isDOBValid = validateDate(row.patient_DOB);
  const isDODValid = validateDate(row.patient_DOD);

  if (!isEmailValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.patient_email,
      fieldName: "patient_email",
      errorRemark: ErrorRemark.EMAIL_ERROR,
    });
  }

  if (!isDOBValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.patient_DOB,
      fieldName: "patient_DOB",
      errorRemark: ErrorRemark.DATE_ERROR,
    });
  }

  if (!isDODValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.patient_DOD,
      fieldName: "patient_DOD",
      errorRemark: ErrorRemark.DATE_ERROR,
    });
  }

  return validations;
};

export const validateNurse = (row: CSVDataRow) => {
  const validations: CSVDataValidation[] = [];
  const isCheckinTimeValid = validateTime(row.nurse_checkIn);
  const iSCheckoutTimeValid = validateTime(row.nurse_checkOut);

  if (!isCheckinTimeValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.nurse_checkIn,
      fieldName: "nurse_checkIn",
      errorRemark: ErrorRemark.TIME_ERROR,
    });
  }

  if (!iSCheckoutTimeValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.nurse_checkOut,
      fieldName: "nurse_checkOut",
      errorRemark: ErrorRemark.TIME_ERROR,
    });
  }

  return validations;
};

export const validatePractitioner = (row: CSVDataRow) => {
  const validations: CSVDataValidation[] = [];
  const isCheckinTimeValid = validateTime(row.practitioner_checkIn);
  const iSCheckoutTimeValid = validateTime(row.practitioner_checkOut);

  if (!isCheckinTimeValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.practitioner_checkIn,
      fieldName: "practitioner_checkIn",
      errorRemark: ErrorRemark.TIME_ERROR,
    });
  }

  if (!iSCheckoutTimeValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.practitioner_checkOut,
      fieldName: "practitioner_checkOut",
      errorRemark: ErrorRemark.TIME_ERROR,
    });
  }

  return validations;
};

export const validateMedication = (row: CSVDataRow) => {
  const validations: CSVDataValidation[] = [];
  const isMedicationLevelValid = isNumber(row.medication_level);

  if (!isMedicationLevelValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.medication_level,
      fieldName: "medication_level",
      errorRemark: ErrorRemark.NUMBER_ERROR,
    });
  }

  return validations;
};

export const validateObservation = (row: CSVDataRow) => {
  const validations: CSVDataValidation[] = [];
  const isObservationDateValid = validateDate(row.observation_date);
  const isObservationTimeValid = validateTime(row.observation_time);

  if (!isObservationDateValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.observation_date,
      fieldName: "observation_date",
      errorRemark: ErrorRemark.DATE_ERROR,
    });
  }

  if (!isObservationTimeValid) {
    validations.push({
      id: row.observation_id,
      dataValue: row.observation_time,
      fieldName: "observation_time",
      errorRemark: ErrorRemark.TIME_ERROR,
    });
  }

  return validations;
};

export const validateHospital = (row: CSVDataRow) => {
  const validations: CSVDataValidation[] = [];
  const validEmail = validateEmailFormat(row.hospital_email);

  if (!validEmail) {
    validations.push({
      id: row.observation_id,
      dataValue: row.hospital_email,
      fieldName: "hospital_email",
      errorRemark: ErrorRemark.EMAIL_ERROR,
    });
  }

  return validations;
};
