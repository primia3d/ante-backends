import { createSuperAdmin } from './createSuperAdmin';
import { createDefaultBoardLanes } from './seedDefaultBoardLanes';
import { createWarehouse } from './createWarehouse';
const main = async () => {
  await createSuperAdmin();
  await createDefaultBoardLanes();
  await createWarehouse();
};

main();
