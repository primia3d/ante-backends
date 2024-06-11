/*
  Warnings:

  - You are about to drop the column `accessibility` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `climateControl` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `forkliftSystem` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `lighting` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `loadingDock` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `rackingSystem` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `security` on the `Warehouse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "accessibility",
DROP COLUMN "climateControl",
DROP COLUMN "forkliftSystem",
DROP COLUMN "lighting",
DROP COLUMN "loadingDock",
DROP COLUMN "rackingSystem",
DROP COLUMN "security";
