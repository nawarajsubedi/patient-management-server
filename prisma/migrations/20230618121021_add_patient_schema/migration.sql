/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F', 'O');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Patient" (
    "patient_ssn" VARCHAR(50) NOT NULL,
    "patient_firstname" VARCHAR(255) NOT NULL,
    "patient_lastname" VARCHAR(255) NOT NULL,
    "patient_country" VARCHAR(255) NOT NULL,
    "patient_address1" VARCHAR(255) NOT NULL,
    "patient_address2" VARCHAR(255) NOT NULL,
    "patient_number1" VARCHAR(20) NOT NULL,
    "patient_number2" VARCHAR(20),
    "patient_sex" "Sex" NOT NULL,
    "patient_dob" TIMESTAMP(3),
    "patient_dod" TIMESTAMP(3),
    "patient_email" VARCHAR(255) NOT NULL,
    "patient_height" DOUBLE PRECISION NOT NULL,
    "patient_weight" DOUBLE PRECISION NOT NULL,
    "patient_bloodtype" VARCHAR(3) NOT NULL,
    "patient_education_background" VARCHAR(255),
    "patient_occupation" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patient_ssn")
);

-- CreateTable
CREATE TABLE "Practitioner" (
    "practitioner_id" VARCHAR(50) NOT NULL,
    "practitioner_firstname" VARCHAR(255),
    "practitioner_lastname" VARCHAR(255),
    "practitioner_address1" VARCHAR(255),
    "practitioner_address2" VARCHAR(255),
    "practitioner_number1" VARCHAR(20),
    "practitioner_number2" VARCHAR(20),
    "practitioner_checkin" TIMESTAMP(3),
    "practitioner_checkout" TIMESTAMP(3),

    CONSTRAINT "Practitioner_pkey" PRIMARY KEY ("practitioner_id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "hospital_id" VARCHAR(50) NOT NULL,
    "hospital_name" VARCHAR(255) NOT NULL,
    "hospital_address" VARCHAR(255) NOT NULL,
    "hospital_number" VARCHAR(255) NOT NULL,
    "hospital_email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("hospital_id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "medication_id" VARCHAR(50) NOT NULL,
    "medication_name" VARCHAR(255) NOT NULL,
    "medication_company" VARCHAR(255) NOT NULL,
    "medication_level" VARCHAR(255) NOT NULL,
    "medication_remark" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("medication_id")
);

-- CreateTable
CREATE TABLE "Nurse" (
    "nurse_id" VARCHAR(50) NOT NULL,
    "nurse_firstname" VARCHAR(255) NOT NULL,
    "nurse_lastname" VARCHAR(255) NOT NULL,
    "nurse_address1" VARCHAR(255) NOT NULL,
    "nurse_address2" VARCHAR(255),
    "nurse_number1" VARCHAR(20),
    "nurse_checkIn" TIMESTAMP(3),
    "nurse_checkOut" TIMESTAMP(3),

    CONSTRAINT "Nurse_pkey" PRIMARY KEY ("nurse_id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "observation_id" VARCHAR(255) NOT NULL,
    "observation_date" TIMESTAMP(3),
    "observation_time" TIMESTAMP(3),
    "observation_remark" TEXT NOT NULL,
    "patient_ssn" VARCHAR(50) NOT NULL,
    "practitioner_id" VARCHAR(50) NOT NULL,
    "nurse_id" VARCHAR(50) NOT NULL,
    "medication_id" VARCHAR(50) NOT NULL,
    "hospital_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("observation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patient_email_key" ON "Patient"("patient_email");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_hospital_email_key" ON "Hospital"("hospital_email");

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_patient_ssn_fkey" FOREIGN KEY ("patient_ssn") REFERENCES "Patient"("patient_ssn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("practitioner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "Nurse"("nurse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "Medication"("medication_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("hospital_id") ON DELETE RESTRICT ON UPDATE CASCADE;
