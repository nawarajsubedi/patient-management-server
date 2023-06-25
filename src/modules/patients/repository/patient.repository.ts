import prisma from "@config/client";
import _ from "lodash";
import { Observation, Prisma } from "@prisma/client";
import { PaginationRequest } from "../dto/pagination.request";
import { DashboardReportRequest } from "../dto/dashobard.request";
import { PaginationPatientResponse } from "../dto/pagination.patient.response";
import { BarChartData, DashboardReport } from "../dto/dashboard.response";
import { PatientDetails } from "../dto/patient.details";
import {
  HighRiskCoveredPractitioner,
  HighRiskObservationReport,
  HighRiskPatient,
} from "../dto/high-risk.report";

import {
  DURATIONS,
  MAX_DOCTOR_VISITED,
  MAX_HOSPITAL_VISITED,
  MAX_OBSERVATIONS,
} from "@modules/patients/constant";

const MIN_DATE = new Date("2000-01-01");
const MAX_DATE = new Date("2099-01-01");

type QueryResult = {
  id: string;
  fullname: string;
  count: string;
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
      },
    },
    take: paginationRequest.size,
    skip: paginationRequest.page * paginationRequest.size,
  };
  const [patients, count] = await prisma.$transaction(async (trx) => {
    const patients = await trx.patient.findMany(query);
    const count = await trx.patient.count({ where: query.where });
    return [patients, count];
  });

  const response: PaginationPatientResponse = {
    pagination: {
      total: count,
      page: paginationRequest.page,
      size: paginationRequest.size,
    },
    data: patients,
  };
  return response;
};

export const fetchPatientDetailById = async (id: string) => {
  const [patient, observations] = await prisma.$transaction(async (trx) => {
    const patient = await trx.patient.findUnique({
      where: { patient_ssn: id },
    });

    const observations = await trx.observation.findMany({
      where: { patient_ssn: id },
      orderBy: { observation_date: "asc" },
      include: { medication: true },
    });
    return [patient, observations];
  });

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
  const patientDetails: PatientDetails = {
    patient,
    observations: data,
  };
  return patientDetails;
};

export const getDashboardReport = async (request: DashboardReportRequest) => {
  const startDate = request.startDate ?? MIN_DATE;
  const endDate = request.endDate ?? MAX_DATE;

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

export const getPatientsByObservationDate = async (
  startDate: string | Date,
  endDate: string | Date
) => {
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
    take: 5,
  });
};

export const getPatientByMedication = async (
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

export const getPatientByNurse = async (
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

export const getPatientByPractitioner = async (
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

export const mapPatientData = (queryResult: QueryResult[]) => {
  const names = queryResult.map((row) => row.fullname);
  const counts = queryResult.map((row) => parseInt(row.count));
  const ids = queryResult.map((row) => row.id);
  const barChartData: BarChartData = {
    names: names,
    ids: ids,
    counts: counts,
  };
  return barChartData;
};

export const getCountResult = async (
  startDate: string | Date,
  endDate: string | Date
) => {
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

  const [patientCount, practitionerCount, nurseCount, observationCount] = _.map(
    countResult,
    "_count._all"
  );

  return { patientCount, practitionerCount, nurseCount, observationCount };
};

export const getHighRiskPatientObservation = async () => {
  const [patients, observations, practitioners] = await Promise.all([
    getHighRiskPatients(),
    getHighRiskObservations(),
    getHighRiskPractitioners(),
  ]);

  const result: HighRiskObservationReport = {
    highRiskPatients: patients,
    observations: observations,
    highRiskCoveredPractitioners: practitioners,
  };

  return result;
};

export const getHighRiskPatients = async () => {
  const patientResult: HighRiskPatient[] = await prisma.$queryRaw`
    SELECT
    p.patient_firstname,
    p.patient_lastname,
    p.patient_email,
    p.patient_address1,
    p.patient_number1,
    o.*
  FROM
    (
      SELECT
        o.patient_ssn,
        true AS is_criteria_observation,
        false AS is_criteria_practitioner_visited,
        false AS is_criteria_hospital_visited
      FROM
        "Observation" o
      WHERE
        observation_date > CURRENT_DATE - INTERVAL '10 months'
      GROUP BY
        patient_ssn
      HAVING
        COUNT(observation_id) > ${MAX_OBSERVATIONS}

      UNION

      SELECT
        o.patient_ssn,
        false AS is_criteria_observation,
        true AS is_criteria_practitioner_visited,
        false AS is_criteria_hospital_visited
      FROM
        "Observation" o
      WHERE
        observation_date > CURRENT_DATE - INTERVAL '${DURATIONS}'
      GROUP BY
        patient_ssn
      HAVING
        COUNT(DISTINCT practitioner_id) > ${MAX_DOCTOR_VISITED}

      UNION

      SELECT
        o.patient_ssn,
        false AS is_criteria_observation,
        false AS is_criteria_practitioner_visited,
        true AS is_criteria_hospital_visited
      FROM
        "Observation" o
      WHERE
        observation_date > CURRENT_DATE - INTERVAL '10 months'
      GROUP BY
        patient_ssn
      HAVING
        COUNT(DISTINCT hospital_id) > ${MAX_HOSPITAL_VISITED}
    ) o
  JOIN
    "Patient" p ON p.patient_ssn = o.patient_ssn
    LIMIT 10;
    `;

  return patientResult;
};

export const getHighRiskObservations = async () => {
  const result: Observation[] = await prisma.$queryRaw`
    SELECT
    o.observation_id,
    o.observation_date,
    observation_time,
    o.observation_remark
  FROM
    "Observation" o
  LEFT JOIN
    "Practitioner" p ON o.practitioner_id = p.practitioner_id
  LEFT JOIN
    "Nurse" n ON o.nurse_id = n.nurse_id
  WHERE
    (p.practitioner_checkout IS NOT NULL AND o.observation_time::time > p.practitioner_checkout::time)
    OR (n."nurse_checkOut" IS NOT NULL AND o.observation_time::time > n."nurse_checkOut"::time);
    `;

  return result;
};

export const getHighRiskPractitioners = async () => {
  const result: HighRiskCoveredPractitioner[] = await prisma.$queryRaw`
    SELECT DISTINCT
      p.practitioner_id AS id,
      p.practitioner_firstname AS firstname,
      p.practitioner_lastname AS lastname,
      TRUE AS is_nurse 
    FROM
      "Observation" o
    LEFT JOIN
      "Practitioner" p ON o.practitioner_id = p.practitioner_id
    WHERE
      (
        p.practitioner_checkout IS NOT NULL
        AND o.observation_time::time > p.practitioner_checkout::time
      )

    UNION ALL

    SELECT DISTINCT
      n.nurse_id AS id,
      n.nurse_firstname AS firstname,
      n.nurse_lastname AS lastname,
      FALSE AS is_nurse 
    FROM
      "Observation" o
    LEFT JOIN
      "Nurse" n ON o.nurse_id = n.nurse_id
    WHERE
      (
        n."nurse_checkOut" IS NOT NULL
        AND o.observation_time::time > n."nurse_checkOut"::time
      );`;

  return result;
};
