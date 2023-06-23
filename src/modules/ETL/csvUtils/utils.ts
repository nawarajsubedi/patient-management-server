import { parseTime } from "@/utils/date";
import {
  CSVDataRow,
  HospitalDto,
  MedicationDto,
  NurseDto,
  ObservationDto,
  PatientDto,
  PatientInfoContainer,
  PractitionerDto,
} from "./interface";
import { parseDate, parseDateDod } from "./parseDate";
import { validateEmailFormat } from "./emailValidator";

export const getAllData = (data: CSVDataRow[]): PatientInfoContainer => {
  let patientResult: PatientInfoContainer;
  let patientDTO: PatientDto;
  let practitionerDTO: PractitionerDto;
  let hospitalDTO: HospitalDto;
  let medicationDTO: MedicationDto;
  let nurseDTO: NurseDto;
  let observationDTO: ObservationDto;

  let currentSSN = "";
  let currentNurseId = "";
  let currentPractitionerId = "";
  let currentMedicationId = "";
  let currentHospitalId = "";

  let patientMap = new Map<string, PatientDto>();
  let practitionerMap = new Map<string, PractitionerDto>();
  let hospitalMap = new Map<string, HospitalDto>();
  let medicationMap = new Map<string, MedicationDto>();
  let nurseMap = new Map<string, NurseDto>();
  let observationMap = new Map<string, ObservationDto>();

  for (let row of data) {
    const {
      patient_ssn,
      nurse_id,
      hospital_id,
      practitioner_id,
      medication_id,
      observation_id,
    } = row;

    patientDTO = getPatientData(row);

    if (patient_ssn.length) {
      currentSSN = patient_ssn;
      patientMap.set(patient_ssn, patientDTO);
    }
    if (nurse_id.length) {
      currentNurseId = nurse_id;
      nurseDTO = getNurseData(row);
      nurseMap.set(nurse_id, nurseDTO);
    }

    if (practitioner_id.length) {
      currentPractitionerId = practitioner_id;
      practitionerDTO = getPractitionerData(row);
      practitionerMap.set(nurse_id, practitionerDTO);
    }

    if (medication_id.length) {
      currentMedicationId = medication_id;
      medicationDTO = getMedicationData(row);
      medicationMap.set(medication_id, medicationDTO);
    }

    if (hospital_id.length) {
      currentHospitalId = hospital_id;
      hospitalDTO = getHospitalData(row);
      hospitalMap.set(hospital_id, hospitalDTO);
    }

    observationDTO = getObservationData({
      row,
      patient_ssn: currentSSN,
      hospital_id: currentHospitalId,
      medication_id: currentMedicationId,
      nurse_id: currentNurseId,
      practitioner_id: currentPractitionerId,
    });
    observationMap.set(row.observation_id, observationDTO);
  }

  patientResult = {
    observationData: [...observationMap.values()],
    hospitalData: [...hospitalMap.values()],
    medicationData: [...medicationMap.values()],
    nurseData: [...nurseMap.values()],
    patientData: [...patientMap.values()],
    practitionerData: [...practitionerMap.values()],
  };
  return patientResult;
};

const getPatientData = (row: CSVDataRow): PatientDto => {
  return {
    patient_ssn: row.patient_ssn,
    patient_firstname: row.patient_firstName,
    patient_lastname: row.patient_lastName,
    patient_country: row.patient_country,
    patient_address1: row.patient_address1,
    patient_address2: row.patient_address2,
    patient_number1: row.patient_number1,
    patient_number2: row.patient_number2,
    patient_sex: row.patient_sex,
    patient_dob: parseDate(row.patient_DOB),
    patient_dod: parseDateDod(row.patient_DOD),
    patient_email: row.patient_email,
    patient_height: parseFloat(row.patient_height),
    patient_weight: parseFloat(row.patient_weight),
    patient_bloodtype: row.patient_bloodType,
    patient_education_background: row.patient_educationBackground,
    patient_occupation: row.patient_occupation,
  };
};

const getObservationData = ({
  row,
  patient_ssn,
  hospital_id,
  medication_id,
  practitioner_id,
  nurse_id,
}: {
  row: CSVDataRow;
  patient_ssn: string;
  hospital_id?: string;
  medication_id?: string;
  practitioner_id?: string;
  nurse_id?: string;
}): ObservationDto => {
  const observationTime = parseTime(row.observation_time, row.observation_date);

  const observationDTO = {
    observation_id: row.observation_id,
    observation_date: parseDate(row.observation_date),
    observation_time: observationTime,
    observation_remark: row.observation_remark,
    patient_ssn: row.patient_ssn || patient_ssn,
    hospital_id: row.hospital_id || hospital_id,
    medication_id: row.medication_id || medication_id,
    practitioner_id: row.practitioner_id || practitioner_id,
    nurse_id: row.nurse_id || nurse_id,
  };
  return observationDTO;
};

const getNurseData = (row: CSVDataRow): NurseDto => {
  let nurseDTO: NurseDto;
  const nurseCheckIn = parseTime(row.nurse_checkIn, row.observation_date);
  const nurseCheckOut = parseTime(row.nurse_checkOut, row.observation_date);
  nurseDTO = {
    nurse_id: row.nurse_id,
    nurse_firstname: row.nurse_firstName,
    nurse_lastname: row.nurse_lastName,
    nurse_address1: row.nurse_address1,
    nurse_address2: row.nurse_address2,
    nurse_number1: row.nurse_number1,
    nurse_checkIn: nurseCheckIn,
    nurse_checkOut: nurseCheckOut,
  };

  return nurseDTO;
};

const getPractitionerData = (row: CSVDataRow): PractitionerDto => {
  let practitionerDTO: PractitionerDto;

  const practitionerCheckIn = parseTime(
    row.practitioner_checkIn,
    row.observation_date
  );
  const practitionerCheckOut = parseTime(
    row.practitioner_checkOut,
    row.observation_date
  );
  practitionerDTO = {
    practitioner_id: row.practitioner_id,
    practitioner_firstname: row.practitioner_firstName,
    practitioner_lastname: row.practitioner_lastName,
    practitioner_address1: row.practitioner_address1,
    practitioner_address2: row.practitioner_address2,
    practitioner_number1: row.practitioner_number1,
    practitioner_number2: row.practitioner_number2,
    practitioner_checkin: practitionerCheckIn,
    practitioner_checkout: practitionerCheckOut,
  };

  return practitionerDTO;
};

const getMedicationData = (row: CSVDataRow): MedicationDto => {
  let medicationDTO: MedicationDto;
  medicationDTO = {
    medication_id: row.medication_id,
    medication_name: row.medication_name,
    medication_company: row.medication_company,
    medication_level: parseFloat(row.medication_level),
    medication_remark: row.medication_remark,
  };

  return medicationDTO;
};

const getHospitalData = (row: CSVDataRow): HospitalDto => {
  let hospitalDTO: HospitalDto;
  const validEmail = validateEmailFormat(row.hospital_email);
  if (!validEmail) {
    //   logger.log("Invalid hospital Email");
  }
  hospitalDTO = {
    hospital_id: row.hospital_id,
    hospital_name: row.hospital_name,
    hospital_address: row.hospital_address,
    hospital_number: row.hospital_number,
    hospital_email: row.hospital_email,
  };

  return hospitalDTO;
};
