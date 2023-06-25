import { Observation } from "@prisma/client";

export interface HighRiskPatient {
  patient_firstname: string;
  patient_lastname: string;
  patient_email: string;
  patient_address1: string;
  patient_number1: string;
  patient_ssn: string;
  is_criteria_observation: boolean;
  is_criteria_practitioner_visited: boolean;
  is_criteria_hospital_visited: boolean;
}

export interface HighRiskCoveredPractitioner {
  id: string;
  firstname: string;
  lastname: string;
  is_nurse: boolean;
}

export interface HighRiskObservationReport {
  highRiskPatients: HighRiskPatient[];
  highRiskCoveredPractitioners: HighRiskCoveredPractitioner[];
  observations: Observation[];
}
