-- CreateTable
CREATE TABLE "Workflow" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateTypeStatic" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "StateTypeStatic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "stateTypeId" INTEGER NOT NULL,
    "workflowId" INTEGER NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transitions" (
    "id" SERIAL NOT NULL,
    "currentState" INTEGER NOT NULL,

    CONSTRAINT "Transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "transitionId" INTEGER NOT NULL,
    "actionTypeId" INTEGER NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionTypeStatic" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "ActionTypeStatic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" SERIAL NOT NULL,
    "transitionId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "conditionTypeId" INTEGER NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionTypeStatic" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "ConditionTypeStatic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateTransitions" (
    "stateId" INTEGER NOT NULL,
    "transitionId" INTEGER NOT NULL,
    "nextState" INTEGER NOT NULL,

    CONSTRAINT "StateTransitions_pkey" PRIMARY KEY ("stateId","transitionId")
);

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_stateTypeId_fkey" FOREIGN KEY ("stateTypeId") REFERENCES "StateTypeStatic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_transitionId_fkey" FOREIGN KEY ("transitionId") REFERENCES "Transitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionTypeId_fkey" FOREIGN KEY ("actionTypeId") REFERENCES "ActionTypeStatic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_transitionId_fkey" FOREIGN KEY ("transitionId") REFERENCES "Transitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_conditionTypeId_fkey" FOREIGN KEY ("conditionTypeId") REFERENCES "ConditionTypeStatic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateTransitions" ADD CONSTRAINT "StateTransitions_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateTransitions" ADD CONSTRAINT "StateTransitions_transitionId_fkey" FOREIGN KEY ("transitionId") REFERENCES "Transitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
