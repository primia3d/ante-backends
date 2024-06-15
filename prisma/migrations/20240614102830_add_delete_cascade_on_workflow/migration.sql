-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "Transitions" DROP CONSTRAINT "Transitions_workflowId_fkey";

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transitions" ADD CONSTRAINT "Transitions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
