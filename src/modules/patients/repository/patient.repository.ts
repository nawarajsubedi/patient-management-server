import prisma from "@config/client";
import { PatientInfoContainer } from "../csvUtils/interface";
import { Prisma } from "@prisma/client";
import { PaginationRequest } from "../dto/pagination.request";
import { DashboardReportRequest } from "../dto/dashobard.request";
import { BarChartData, DashboardReport } from "../dto/dashboard.response";

const MIN_DATE = new Date("2000-01-01");
const MAX_DATE = new Date("2099-01-01");
type QueryResult = {
  id: string;
  fullname: string;
  count: string;
};

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
        orderBy: { observation_date: "asc" },
        take: 1,
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

export const getTotalPatientsDetails = async (
  request: DashboardReportRequest
) => {
  const startDate = request.startDate ?? MIN_DATE;
  const endDate = request.startDate ?? MAX_DATE;

  const countResult = await getCountResult(startDate, endDate);
  const practitionerByPatient = await getPatientByPractitioner(
    startDate,
    endDate
  );

  const nurseByPatient = await getPatientByNurse(startDate, endDate);

  const medicationByPatient = await getPatientByMedication(startDate, endDate);

  const patients = await getPatientsByObservationDate(startDate, endDate);

  const dashboardReport: DashboardReport = {
    ...countResult,
    nurseByPatient: nurseByPatient,
    practitionerByPatient: practitionerByPatient,
    medicationByPatient: medicationByPatient,
    patients: patients,
  };

  return dashboardReport;
};
async function getPatientsByObservationDate(
  startDate: string | Date,
  endDate: string | Date
) {
  return await prisma.patient.findMany({
    include: {
      observation: {
        where: {
          observation_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          observation_date: "desc",
        },
        include: {
          medication: true,
        },
        take: 1,
      },
    },
    take: 10,
  });
}

const getPatientByMedication = async (
  startDate: string | Date,
  endDate: string | Date
): Promise<BarChartData> => {
  const medicationResult: QueryResult[] = await prisma.$queryRaw`
  SELECT m.medication_id AS id, m.medication_name AS fullname,
    COUNT(DISTINCT o.patient_ssn) AS count
  FROM "Observation" o
  INNER JOIN "Medication" m ON m.medication_id = o.medication_id
  WHERE o.observation_date BETWEEN ${startDate} AND ${endDate}
  GROUP BY m.medication_id
  ORDER BY "fullname"
  LIMIT 10;
`;

  return mapPatientData(medicationResult);
};

const getPatientByNurse = async (
  startDate: string | Date,
  endDate: string | Date
): Promise<BarChartData> => {
  const nursesResult: QueryResult[] = await prisma.$queryRaw`
  SELECT n.nurse_id AS id, n.nurse_firstname || ' ' || n.nurse_lastname AS fullname,
    COUNT(DISTINCT o.patient_ssn) AS count
  FROM "Observation" o
  INNER JOIN "Nurse" n ON n.nurse_id = o.nurse_id
  WHERE o.observation_date BETWEEN ${startDate} AND ${endDate}
  GROUP BY n.nurse_id
  ORDER BY "fullname"
  LIMIT 10;
`;

  return mapPatientData(nursesResult);
};

const getPatientByPractitioner = async (
  startDate: string | Date,
  endDate: string | Date
): Promise<BarChartData> => {
  const practitionerResult: QueryResult[] = await prisma.$queryRaw`
  SELECT p.practitioner_id AS id, p.practitioner_firstname || ' ' || p.practitioner_lastname AS fullname,
    COUNT(DISTINCT o.patient_ssn) AS count
  FROM "Observation" o
  INNER JOIN "Practitioner" p ON o.practitioner_id = p.practitioner_id
  WHERE o.observation_date BETWEEN ${startDate} AND ${endDate}
  GROUP BY p.practitioner_id
  ORDER BY "fullname"
  LIMIT 10;
`;

  return mapPatientData(practitionerResult);
};

function mapPatientData(queryResult: QueryResult[]) {
  const names = queryResult.map((row) => row.fullname);
  const counts = queryResult.map((row) => parseInt(row.count));
  const ids = queryResult.map((row) => row.id);
  const barChartData: BarChartData = {
    names: names,
    ids: ids,
    counts: counts,
  };
  return barChartData;
}

async function getCountResult(
  startDate: string | Date,
  endDate: string | Date
) {
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
          gte: startDate,
          lte: endDate,
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
  return { patientCount, practitionerCount, nurseCount, observationCount };
}
