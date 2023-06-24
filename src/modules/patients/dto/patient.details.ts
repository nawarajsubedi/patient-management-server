import { Patient } from "@prisma/client";

interface PatientObservation {
  observationId: string;
  patientSsn: string;
  observationDate: Date;
  medicationName: string;
  medicationId: string;
  medicationLevel: number;
}

export interface PatientDetails {
  patient: Patient;
  observations: PatientObservation[];
}
