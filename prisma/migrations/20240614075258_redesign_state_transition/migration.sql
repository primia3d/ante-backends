/*
  Warnings:

  - The primary key for the `StateTransitions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nextState` on the `StateTransitions` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `StateTransitions` table. All the data in the column will be lost.
  - You are about to drop the column `currentState` on the `Transitions` table. All the data in the column will be lost.
  - Added the required column `currentStateId` to the `StateTransitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextStateId` to the `StateTransitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Transitions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StateTransitions" DROP CONSTRAINT "StateTransitions_stateId_fkey";

-- AlterTable
ALTER TABLE "StateTransitions" DROP CONSTRAINT "StateTransitions_pkey",
DROP COLUMN "nextState",
DROP COLUMN "stateId",
ADD COLUMN     "currentStateId" INTEGER NOT NULL,
ADD COLUMN     "nextStateId" INTEGER NOT NULL,
ADD CONSTRAINT "StateTransitions_pkey" PRIMARY KEY ("currentStateId", "transitionId");

-- AlterTable
ALTER TABLE "Transitions" DROP COLUMN "currentState",
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "StateTransitions" ADD CONSTRAINT "StateTransitions_currentStateId_fkey" FOREIGN KEY ("currentStateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateTransitions" ADD CONSTRAINT "StateTransitions_nextStateId_fkey" FOREIGN KEY ("nextStateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
