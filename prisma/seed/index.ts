import { createSuperAdmin } from './createSuperAdmin';
import { createDefaultBoardLanes } from './seedDefaultBoardLanes';
import { createWarehouse } from './createWarehouse';
import { createGeneralAndVariantInventory } from './createInventory';
import { setDefaultBoardLaneConfiguration } from './seedConfigurationOfDefaultBoardLanes';
import { seedDefaultWorkflowStateTypeStatic } from './seedDefaultWorkflowStateTypeStatic';
const main = async () => {
  await createSuperAdmin();
  await createDefaultBoardLanes();
  await createWarehouse();
  await createGeneralAndVariantInventory();
  await setDefaultBoardLaneConfiguration();
  await seedDefaultWorkflowStateTypeStatic();
};

main();
