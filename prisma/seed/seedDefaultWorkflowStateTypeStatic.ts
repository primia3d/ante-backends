import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedDefaultWorkflowStateTypeStatic = async () => {
  const defaultWorkflowStateTypeStaticData = [
    { type: 'START', description: 'Initial state of the workflow' },
    { type: 'IN_PROGRESS', description: 'Regular state in the workflow' },
    { type: 'DONE', description: 'Final state indicating completion' },
    { type: 'DENIED', description: 'State indicating denial' },
    { type: 'CANCELLED', description: 'State indicating cancellation' },
  ];

  const checkIfExist = await prisma.workflowStateTypeStatic.findMany({
    where: {
      type: {
        in: defaultWorkflowStateTypeStaticData.map(
          (stateType) => stateType.type,
        ),
      },
    },
  });

  if (checkIfExist.length === 0) {
    await prisma.workflowStateTypeStatic.createMany({
      data: defaultWorkflowStateTypeStaticData,
    });
  }
};
