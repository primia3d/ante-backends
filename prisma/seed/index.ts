import { createSuperAdmin } from './createSuperAdmin';
import { createDefaultBoardLanes } from './seedDefaultBoardLanes';
import { createWarehouse } from './createWarehouse';
import { createGeneralAndVariantInventory } from './createInventory';
import { createDefaultWorkflowStaticTypes } from './seedDefaultStateType';
const main = async () => {
  await createSuperAdmin();
  await createDefaultBoardLanes();
  await createWarehouse();
  await createGeneralAndVariantInventory();
  await createDefaultWorkflowStaticTypes();
};

main();
