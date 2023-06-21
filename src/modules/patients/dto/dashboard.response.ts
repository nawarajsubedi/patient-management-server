import { Medication, Observation, Patient } from "@prisma/client";

export interface DashboardReport {
  patientCount: number;
  nurseCount: number;
  practitionerCount: number;
  observationCount: number;
  practitionerByPatient: BarChartData;
  nurseByPatient: BarChartData;
  medicationByPatient: BarChartData;
  patients: (Patient & {
    observation: (Observation & {
      medication: Medication;
    })[];
  })[];
}

export interface BarChartData {
  names: string[];
  ids: string[];
  counts: number[];
}
