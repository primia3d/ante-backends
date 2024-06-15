/*
  Warnings:

  - Added the required column `location` to the `GeneralInventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `GeneralInventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneralInventory" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL;
