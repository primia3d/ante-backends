import { createSuperAdmin } from './createSuperAdmin';
import { createDefaultBoardLanes } from './seedDefaultBoardLanes';
import { createWarehouse } from './createWarehouse';
import { createGeneralAndVariantInventory } from './createInventory';
import { setDefaultBoardLaneConfiguration } from './seedConfigurationOfDefaultBoardLanes';
const main = async () => {
  await createSuperAdmin();
  await createDefaultBoardLanes();
  await createWarehouse();
  await createGeneralAndVariantInventory();
  await setDefaultBoardLaneConfiguration();
};

main();
