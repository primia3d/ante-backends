/*
  Warnings:

  - Added the required column `name` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
