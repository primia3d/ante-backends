import { createSuperAdmin } from './createSuperAdmin';
import { createDefaultBoardLanes } from './seedDefaultBoardLanes';
import { createWarehouse } from './createWarehouse';
import { createGeneralAndVariantInventory } from './createInventory';
const main = async () => {
  await createSuperAdmin();
  await createDefaultBoardLanes();
  await createWarehouse();
  await createGeneralAndVariantInventory();
};

main();
