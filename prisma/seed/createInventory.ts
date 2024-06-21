import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createGeneralAndVariantInventory = async () => {
  const superAdmin = await prisma.account.findFirst({
    where: { username: 'admin123' },
  });

  const warehouse = await prisma.warehouse.findFirst({
    where: { name: 'Main warehouse' },
  });

  if (!superAdmin || !warehouse) {
    throw new Error('Super Admin or Warehouse not found');
  }

  const checkIfExist = await prisma.generalInventory.findFirst({
    where: { description: 'General Inventory Description' },
  });

  if (!checkIfExist) {
    const generalInventory = await prisma.generalInventory.create({
      data: {
        itemNumber: 1,
        description: 'General Inventory Description',
        warehouse: { connect: { id: warehouse.id } },
        location: 'Main warehouse',
        createdBy: { connect: { id: superAdmin.id } },
        updatedBy: { connect: { id: superAdmin.id } },
      },
    });

    const variantInventories = [
      {
        itemNumber: 1.1,
        variationName: 'Variant 1',
        variationDescription: 'Description for variant 1',
        stocks: 100,
        unitOfMeasure: 'pcs',
        unitPrice: 10,
        total: 1000,
        generalInventoryId: generalInventory.id,
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
      },
      {
        itemNumber: 1.2,
        variationName: 'Variant 2',
        variationDescription: 'Description for variant 2',
        stocks: 200,
        unitOfMeasure: 'pcs',
        unitPrice: 20,
        total: 4000,
        generalInventoryId: generalInventory.id,
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
      },
      {
        itemNumber: 1.3,
        variationName: 'Variant 3',
        variationDescription: 'Description for variant 3',
        stocks: 150,
        unitOfMeasure: 'pcs',
        unitPrice: 15,
        total: 2250,
        generalInventoryId: generalInventory.id,
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
      },
    ];

    await prisma.variationInventory.createMany({
      data: variantInventories,
    });
  }
};
