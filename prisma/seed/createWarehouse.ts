import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export const createWarehouse = async () => {
  const jsonDataPath = path.resolve(process.cwd(), 'data', 'warehouse-options.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));

  
  const superAdmin = await prisma.account.findFirst({
    where: { username: 'admin123' },
  });

  let warehouse = await prisma.warehouse.findFirst({
    where: { name: 'Main warehouse' },
  });

  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: {
        name: 'Main warehouse',
        location: 'Main location',
        size: 100,
        storageCapacity: 1000, 
        createdBy: { connect: { id: superAdmin.id } },
        updatedBy: { connect: { id: superAdmin.id } },
      },
    });
  }
};
