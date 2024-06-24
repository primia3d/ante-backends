/*
  Warnings:

  - Added the required column `workflowStateTypeId` to the `WorkflowState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkflowRequestData" ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowState" ADD COLUMN     "workflowStateTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "WorkflowStateTypeStatic" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "WorkflowStateTypeStatic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowStateTypeStatic_type_key" ON "WorkflowStateTypeStatic"("type");

-- CreateIndex
CREATE INDEX "WorkflowState_workflowId_idx" ON "WorkflowState"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowState_workflowStateTypeId_idx" ON "WorkflowState"("workflowStateTypeId");

-- AddForeignKey
ALTER TABLE "WorkflowState" ADD CONSTRAINT "WorkflowState_workflowStateTypeId_fkey" FOREIGN KEY ("workflowStateTypeId") REFERENCES "WorkflowStateTypeStatic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
