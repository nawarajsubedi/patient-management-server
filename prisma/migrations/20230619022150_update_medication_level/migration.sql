/*
  Warnings:

  - Changed the type of `medication_level` on the `Medication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "medication_level",
ADD COLUMN     "medication_level" DOUBLE PRECISION NOT NULL;
