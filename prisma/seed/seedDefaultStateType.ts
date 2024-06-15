import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDefaultWorkflowStaticTypes = async () => {
  await seedDefaultStateType();
  await seedDefaultActionType();
  await seedDefaultConditionType();
};

const seedDefaultStateType = async () => {
  const defaultStateStatic = [
    { name: 'START' },
    {
      name: 'IN_PROGRESS',
    },
    { name: 'DONE' },
  ];

  let stateStatic = await prisma.stateTypeStatic.findMany({
    where: {
      OR: defaultStateStatic.map((state) => ({ name: state.name })),
    },
  });

  if (stateStatic.length === 0) {
    await prisma.stateTypeStatic.createMany({
      data: defaultStateStatic,
    });
  }
};

const seedDefaultActionType = async () => {
  const defaultActionType = [
    { name: 'APPROVE' },
    {
      name: 'DECLINE',
    },
  ];

  let checkActionTypeExist = await prisma.actionTypeStatic.findMany({
    where: {
      OR: defaultActionType.map((action) => ({ name: action.name })),
    },
  });

  if (checkActionTypeExist.length === 0) {
    await prisma.actionTypeStatic.createMany({
      data: defaultActionType,
    });
  }
};

const seedDefaultConditionType = async () => {
  const defaultConditionType = [
    { type: 'RESTRICT_BY_USER', description: 'Restrict by user' },
    {
      type: 'RESTRICT_BY_ROLE_GROUP',
      description: 'Restrict by RoleGroup',
    },
  ];

  let checkConditionTypeExist = await prisma.conditionTypeStatic.findMany({
    where: {
      OR: defaultConditionType.map((action) => ({ type: action.type })),
    },
  });

  if (checkConditionTypeExist.length === 0) {
    await prisma.conditionTypeStatic.createMany({
      data: defaultConditionType,
    });
  }
};
