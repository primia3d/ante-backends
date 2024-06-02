/*
  Warnings:

  - You are about to drop the column `accountId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_accountId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "accountId";
