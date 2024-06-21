import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setDefaultBoardLaneConfiguration = async () => {
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

  if (checkIfExist.length > 0) {
    const updatePromises = checkIfExist.map((lane) => {
      let key;
      switch (lane.name) {
        case 'BackLog':
          key = 'BACKLOG';
          break;
        case 'In Progress':
          key = 'IN_PROGRESS';
          break;
        case 'Done':
          key = 'DONE';
          break;
        default:
          key = null;
      }

      if (key) {
        return prisma.boardLane.update({
          where: { id: lane.id },
          data: {
            key,
            isDefault: true,
          },
        });
      }
    });

    await Promise.all(updatePromises);
  }
};
