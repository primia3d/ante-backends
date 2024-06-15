/*
  Warnings:

  - Added the required column `workflowId` to the `Transitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transitions" ADD COLUMN     "workflowId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transitions" ADD CONSTRAINT "Transitions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
