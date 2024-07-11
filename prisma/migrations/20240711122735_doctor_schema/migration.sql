-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "needPasswordChange" SET DEFAULT true;

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contractNumber" TEXT NOT NULL,
    "address" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "exprience" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "appointmentFee" INTEGER NOT NULL,
    "qualification" TEXT NOT NULL,
    "currentWorkingPlace" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
