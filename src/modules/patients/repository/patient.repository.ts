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
    include: {
      observation: {
        select: {
          observation_date: true,
          medication: true,
        },
        // include: {
        //   medication: {
        //     select: {
        //       medication_id: true,
        //       medication_level: true,
        //     },
        //   },
        // },
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

export const fetchPatientDetailById = async (id: string) => {
  const [patient, observations] = await prisma.$transaction([
    prisma.patient.findUnique({
      where: { patient_ssn: id },
    }),
    prisma.observation.findMany({
      where: { patient_ssn: id },
      orderBy: { observation_date: "asc" },
      include: { medication: true },
    }),
  ]);
  // const observationData = await prisma.observation.findMany({
  //   where: { patient_ssn: id },
  //   orderBy: { observation_date: "asc" },
  //   include: { medication: true },
  // });

  const data = observations.map((o) => {
    return {
      observationId: o.observation_id,
      patientSsn: o.patient_ssn,
      observationDate: o.observation_date,
      medicationName: o.medication.medication_name,
      medicationId: o.medication_id,
      medicationLevel: o.medication.medication_level,
    };
  });
  return { patient, observations: data };
};
