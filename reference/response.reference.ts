export default {
  account: {
    id: 'string',
    email: 'string',
    username: 'string',
    firstName: 'string',
    lastName: 'string',
    contactNumber: 'string',
    createdAt: 'date',
    role: 'role',
    parentAccountId: 'string',
    image: 'string',
  },
  role: {
    id: 'string',
    name: 'string',
    description: 'string',
    isDeveloper: 'boolean',
    isDeleted: 'boolean',
    updatedAt: 'date',
    createdAt: 'date',
    roleScope: 'roleScope',
    roleGroupId: 'string',
    roleGroup: 'roleGroup',
    level: 'string',
  },
  roleScope: {
    roleID: 'string',
    scopeID: 'string',
    scope: 'scope',
  },
  scope: {
    id: 'string',
    type: 'string',
    name: 'string',
    description: 'string',
  },
  roleGroup: {
    id: 'string',
    name: 'string',
    description: 'string',
    isDeleted: 'boolean',
  },
  client: {
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    contactNumber: 'string',
    description: 'string',
    email: 'string',
    address: 'string',
    isDeleted: 'boolean',
    createdAt: 'date',
  },
  project: {
    id: 'string',
    name: 'string',
    description: 'string',
    budget: 'currency',
    address: 'string',
    isDeleted: 'boolean',
    startDate: 'date',
    endDate: 'date',
    status: 'enum',
    client: 'client',
    computedDate: 'string',
  },
  boardLane: {
    id: 'string',
    name: 'string',
    description: 'string',
    order: 'number',
  },

  warehouse: {
    id: 'string',
    name: 'string',
    location: 'string',
    size: 'number',
    storageCapacity: 'number',
    createdAt: 'date',
    updatedAt: 'date',
    isDeleted: 'boolean',
    createdBy: 'account',
    updatedBy: 'account',
  },
  generalInventory: {
    id: 'string',
    itemNumber: 'number',
    description: 'string',
    location: 'string',
    warehouseId: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    isDeleted: 'boolean',
    createdBy: 'account',
    updatedBy: 'account',
  },
  variantInventory: {
    id: 'string',
    itemNumber: 'number',
    variationName: 'string',
    variationDescription: 'string',
    stocks: 'number',
    unitOfMeasure: 'string',
    unitPrice: 'number',
    total: 'number',
    generalInventoryId: 'string',
    createdById: 'string',
    updatedById: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    isDeleted: 'boolean',
    createdBy: 'account',
    updatedBy: 'account',
  },
  workflow: {
    id: 'number',
    description: 'string',
    name: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    isDeleted: 'boolean',
  },
  workflowStateType: {
    id: 'number',
    description: 'string',
    title: 'string',
  },
  workflowState: {
    id: 'number',
    name: 'string',
    description: 'string',
    workflowId: 'number',
    workflowStateTypeId: 'number',
    workflow: 'workflow',
    workflowStateType: 'workflowStateType',
  },
};
