import prisma from "@config/client";
import _ from "lodash";
import { PatientInfoContainer } from "../csvUtils/interface";

export const updateObservationData = async (data: PatientInfoContainer) => {
  const {
    patientData,
    hospitalData,
    nurseData,
    practitionerData,
    medicationData,
    observationData,
  } = data;

  await prisma.$transaction(async (trx) => {
    await trx.patient.createMany({
      data: [...patientData],
      skipDuplicates: true,
    });

    await trx.hospital.createMany({
      data: [...hospitalData],
      skipDuplicates: true,
    });

    await trx.nurse.createMany({
      data: [...nurseData],
      skipDuplicates: true,
    });

    await trx.practitioner.createMany({
      data: [...practitionerData],
      skipDuplicates: true,
    });

    await trx.medication.createMany({
      data: [...medicationData],
      skipDuplicates: true,
    });

    await trx.observation.createMany({
      data: [...observationData],
      skipDuplicates: true,
    });
  });
  return true;
};
