import prisma from "@config/client";
import { PatientInfoContainer } from "../csvUtils/interface";
import { Prisma } from "@prisma/client";
import { PaginationRequest } from "../dto/pagination.request";
import { DashboardReportRequest } from "../dto/dashobard.request";

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

type QueryResult = {
  practitioner_name: string;
  patient_count: number;
};

export const getTotalPatientsDetails = async (
  request: DashboardReportRequest
) => {
  const minStartDate = new Date("2000-01-01");
  const maxStartDate = new Date("2099-01-01");
  const countResult = await prisma.$transaction([
    prisma.patient.aggregate({
      _count: {
        _all: true,
      },
    }),
    prisma.practitioner.aggregate({
      _count: {
        _all: true,
      },
    }),
    prisma.nurse.aggregate({
      _count: {
        _all: true,
      },
    }),
    prisma.observation.aggregate({
      where: {
        observation_date: {
          gte: request.startDate ?? minStartDate,
          lte: request.endDate ?? maxStartDate,
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const [
    {
      _count: { _all: patientCount },
    },
    {
      _count: { _all: practitionerCount },
    },
    {
      _count: { _all: nurseCount },
    },
    {
      _count: { _all: observationCount },
    },
  ] = countResult;
  const result: QueryResult[] = await prisma.$queryRaw`
  SELECT p.practitioner_firstname || ' ' || p.practitioner_lastname AS practitioner_name,
    COUNT(DISTINCT o.patient_ssn) AS patient_count
  FROM "Observation" o
  INNER JOIN "Practitioner" p ON o.practitioner_id = p.practitioner_id
  GROUP BY p.practitioner_id;
`;

  const practitionerNames = result.map((row) => row.practitioner_name);
  const patientCounts = result.map((row) => row.patient_count);

  console.log(practitionerNames);
  console.log(patientCounts);

  debugger;
  // const totalPatients = patientRepository.getTotalPatientsDetails(request);
  // const dashboardDetails = await getDashboardReport(request);
  return null;
};
