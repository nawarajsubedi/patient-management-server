import { parseTime } from "@/utils/date";
import { validateEmailFormat } from "../emailValidator";
import { parseDate, parseDateDod } from "../parseDate";
import {
  CSVDataRow,
  HospitalDTO,
  MedicationDTO,
  NurseDto,
  ObservationDTO,
  PatientDTO,
  PractitionerDto,
} from "./interface";

export const getAllData = (data: CSVDataRow[]) => {
  let patientDTO: PatientDTO;
  let practitionerDTO: PractitionerDto;
  let hospitalDTO: HospitalDTO;
  let medicationDTO: MedicationDTO;
  let nurseDTO: NurseDto;
  let ObservationDTO: ObservationDTO;

  let currentSSN = "";
  let currentNurseId = "";
  let currentPractitionerId = "";
  let currentMedicationId = "";
  let currentHospitalId = "";

  let patientMap = new Map<string, PatientDTO>();
  let practitionerMap = new Map<string, PractitionerDto>();
  let hospitalMap = new Map<string, HospitalDTO>();
  let medicationMap = new Map<string, MedicationDTO>();
  let nurseMap = new Map<string, NurseDto>();
  let observationMap = new Map<string, ObservationDTO>();

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

    ObservationDTO = getObservationData({
      row,
      patient_ssn: currentSSN,
      hospital_id: currentHospitalId,
      medication_id: currentMedicationId,
      nurse_id: currentNurseId,
      practitioner_id: currentPractitionerId,
    });
    observationMap.set(row.observation_id, ObservationDTO);
  }
  debugger;
};

const getPatientData = (row: CSVDataRow): PatientDTO => {
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
}): ObservationDTO => {
  const observationTime = parseTime(row.observation_time, row.observation_date);

  const observationDTO = {
    observation_id: row.observation_id,
    observation_date: parseDate(row.observation_date),
    observation_time: observationTime,
    observation_remark: row.observation_remark,
    patient_ssn: row.patient_ssn.length > 0 ? row.patient_ssn : patient_ssn,
    hospital_id: row.hospital_id ?? hospital_id,
    medication_id: row.medication_id ?? medication_id,
    practitioner_id: row.practitioner_id ?? practitioner_id,
    nurse_id: row.nurse_id ?? nurse_id,
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
  const nurseCheckIn = parseTime(row.nurse_checkIn, row.observation_date);
  const nurseCheckOut = parseTime(row.nurse_checkOut, row.observation_date);

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

const getMedicationData = (row: CSVDataRow): MedicationDTO => {
  let medicationDTO: MedicationDTO;
  medicationDTO = {
    medication_id: row.medication_id,
    medication_name: row.medication_name,
    medication_company: row.medication_company,
    medication_level: row.medication_level,
    medication_remark: row.medication_remark,
  };

  return medicationDTO;
};

const getHospitalData = (row: CSVDataRow): HospitalDTO => {
  let hospitalDTO: HospitalDTO;
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

export function getDtos(row: CSVDataRow) {
  let patientDTO: PatientDTO;

  let practitionerDTO: PractitionerDto;

  let hospitalDTO: HospitalDTO;

  let medicationDTO: MedicationDTO;

  let nurseDTO: NurseDto;

  let currentSSN = "";
  let currentNurseId = "";
  let currentPractitionerId = "";
  let currentMedicationId = "";
  let currentHospitalId = "";

  const {
    patient_ssn,
    nurse_id,
    hospital_id,
    practitioner_id,
    medication_id,
    observation_id,
  } = row;

  //   const logger = new Logger();
  if (patient_ssn.length > 1) {
    currentSSN = patient_ssn;

    const validEmail = validateEmailFormat(row.patient_email);
    if (!validEmail) {
      //   logger.log("Invalid patient Email");
    }

    patientDTO = {
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
  }

  if (nurse_id.length > 1) {
    const nurseCheckIn = parseTime(row.nurse_checkIn, row.observation_date);
    const nurseCheckOut = parseTime(row.nurse_checkOut, row.observation_date);
    currentNurseId = nurse_id;
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
  }

  if (practitioner_id.length > 1) {
    currentPractitionerId = practitioner_id;
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
  }

  if (hospital_id.length > 1) {
    currentHospitalId = hospital_id;

    const validEmail = validateEmailFormat(row.hospital_email);
    if (!validEmail) {
      //   logger.log("Invalid hospital Email");
    }
    hospitalDTO = {
      hospital_id: row.hospital_id,
      hospital_name: row.hospital_name,
      hospital_address: row.hospital_name,
      hospital_number: row.hospital_number,
      hospital_email: row.hospital_email,
    };
  }

  if (medication_id.length > 1) {
    currentMedicationId = medication_id;
    medicationDTO = {
      medication_id: row.medication_id,
      medication_name: row.medication_name,
      medication_company: row.medication_company,
      medication_level: row.medication_level,
      medication_remark: row.medication_remark,
    };
  }

  const observationTime = parseTime(row.observation_time, row.observation_date);

  const observationDTO = {
    observation_id: observation_id,
    observation_date: parseDate(row.observation_date),
    observation_time: observationTime,
    observation_remark: row.observation_remark,
    patient_ssn: currentSSN,
    hospital_id: currentHospitalId,
    medication_id: currentMedicationId,
    practitioner_id: currentPractitionerId,
    nurse_id: currentNurseId,
  };
  return {
    id: {
      currentSSN,
      currentNurseId,
      currentHospitalId,
      currentMedicationId,
      currentPractitionerId,
    },
    dtos: {
      patientDTO,
      nurseDTO,
      observationDTO,
      medicationDTO,
      practitionerDTO,
      hospitalDTO,
    },
  };
}
