/*
  Warnings:

  - Added the required column `name` to the `GeneralInventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneralInventory" ADD COLUMN     "name" TEXT NOT NULL;
