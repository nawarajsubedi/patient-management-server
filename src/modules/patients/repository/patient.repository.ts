import prisma from "@config/client";
import { PatientInfoContainer } from "../csvUtils/interface";
import { Prisma } from "@prisma/client";
import { PaginationRequest } from "../dto/pagination.request";

export const insertOrUpdatePatientData = async (data: PatientInfoContainer) => {
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
};

export const getAllPatients = async (paginationRequest: PaginationRequest) => {
  const query: Prisma.PatientFindManyArgs = {
    where: {
      patient_ssn: {
        contains: paginationRequest.search,
      },
    },
    take: paginationRequest.size,
    skip: paginationRequest.page * paginationRequest.size,
  };
  const [patients, count] = await prisma.$transaction([
    prisma.patient.findMany(query),
    prisma.patient.count({ where: query.where }),
  ]);

  return {
    pagination: {
      total: count,
      page: paginationRequest.page,
      size: paginationRequest.size,
    },
    data: patients,
  };
};
