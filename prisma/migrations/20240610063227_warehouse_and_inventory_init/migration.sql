-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "storageCapacity" DOUBLE PRECISION NOT NULL,
    "forkliftSystem" TEXT NOT NULL,
    "rackingSystem" TEXT NOT NULL,
    "lighting" TEXT NOT NULL,
    "loadingDock" TEXT NOT NULL,
    "security" TEXT NOT NULL,
    "climateControl" TEXT NOT NULL,
    "accessibility" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralInventory" (
    "id" TEXT NOT NULL,
    "itemNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "GeneralInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariationInventory" (
    "id" TEXT NOT NULL,
    "itemNumber" TEXT NOT NULL,
    "variationName" TEXT NOT NULL,
    "variationDescription" TEXT NOT NULL,
    "stocks" INTEGER NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "generalInventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "VariationInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_id_key" ON "Warehouse"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInventory_id_key" ON "GeneralInventory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInventory_itemNumber_key" ON "GeneralInventory"("itemNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VariationInventory_id_key" ON "VariationInventory"("id");

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralInventory" ADD CONSTRAINT "GeneralInventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralInventory" ADD CONSTRAINT "GeneralInventory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralInventory" ADD CONSTRAINT "GeneralInventory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationInventory" ADD CONSTRAINT "VariationInventory_generalInventoryId_fkey" FOREIGN KEY ("generalInventoryId") REFERENCES "GeneralInventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationInventory" ADD CONSTRAINT "VariationInventory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationInventory" ADD CONSTRAINT "VariationInventory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
