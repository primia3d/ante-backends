import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDefaultBoardLanes = async () => {
  const defaultBoardLanes = [
    { name: 'BackLog', order: 1, description: 'Tasks to be done' },
    {
      name: 'In Progress',
      order: 2,
      description: 'Tasks currently being worked on',
    },
    { name: 'Done', order: 3, description: 'Tasks that have been completed' },
  ];

  for (const lane of defaultBoardLanes) {
    await prisma.boardLane.create({
      data: lane,
    });
  }
};
