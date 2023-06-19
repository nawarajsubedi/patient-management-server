-- DropForeignKey
ALTER TABLE "Observation" DROP CONSTRAINT "Observation_nurse_id_fkey";

-- AlterTable
ALTER TABLE "Observation" ALTER COLUMN "nurse_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_nurse_id_fkey" FOREIGN KEY ("nurse_id") REFERENCES "Nurse"("nurse_id") ON DELETE SET NULL ON UPDATE CASCADE;
