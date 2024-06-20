/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `BoardLane` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BoardLane" ADD COLUMN     "key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BoardLane_key_key" ON "BoardLane"("key");
