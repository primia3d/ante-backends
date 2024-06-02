import { createSuperAdmin } from './createSuperAdmin';
import { createDefaultBoardLanes } from './seedDefaultBoardLanes';
const main = async () => {
  await createSuperAdmin();
  await createDefaultBoardLanes();
};

main();
