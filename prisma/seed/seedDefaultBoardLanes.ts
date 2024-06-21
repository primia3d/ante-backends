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

  const checkIfExist = await prisma.boardLane.findMany({
    where: {
      name: {
        in: defaultBoardLanes.map((lane) => lane.name),
      },
    },
  });

  if (checkIfExist.length === 0) {
    for (const lane of defaultBoardLanes) {
      await prisma.boardLane.create({
        data: lane,
      });
    }
  }
};
