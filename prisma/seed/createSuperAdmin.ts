import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../../lib/encryption.service';

const prisma = new PrismaClient();
let crypt = new EncryptionService();

export const createSuperAdmin = async () => {
  let roleGroup = await prisma.roleGroup.findFirst({
    where: { name: 'Admin Developer' },
  });

  let role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
  let developerUser = await prisma.account.findFirst({
    where: { username: 'admin123' },
  });

  if (!roleGroup) {
    roleGroup = await prisma.roleGroup.create({
      data: {
        name: 'Admin Developer',
        description: 'Admin Developer Department',
        isDeleted: false,
      },
    });
  }

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'Super Admin',
        description: 'Can do all things',
        isDeveloper: true,
        roleGroupId: roleGroup.id,
      },
    });
  }

  let password_encryption = await crypt.encrypt('water123');

  if (!developerUser) {
    await prisma.account.create({
      data: {
        firstName: 'Admin',
        lastName: 'Developer',
        contactNumber: '123456789',
        email: 'developer@gmail.com',
        username: 'admin123',
        password: password_encryption.encrypted,
        roleId: role.id,
        key: password_encryption.iv,
      },
    });
  }
};
