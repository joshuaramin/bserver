/*
  Warnings:

  - You are about to drop the column `student_id` on the `IdentityCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[college_id]` on the table `IdentityCard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "IdentityCard" DROP CONSTRAINT "IdentityCard_student_id_fkey";

-- AlterTable
ALTER TABLE "College" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "IdentityCard" DROP COLUMN "student_id",
ADD COLUMN     "college_id" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "IdentityCard_college_id_key" ON "IdentityCard"("college_id");

-- AddForeignKey
ALTER TABLE "IdentityCard" ADD CONSTRAINT "IdentityCard_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "College"("college_id") ON DELETE SET NULL ON UPDATE CASCADE;
