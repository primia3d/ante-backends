/*
  Warnings:

  - A unique constraint covering the columns `[itemNumber]` on the table `VariationInventory` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `itemNumber` on the `GeneralInventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemNumber` on the `VariationInventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GeneralInventory" DROP COLUMN "itemNumber",
ADD COLUMN     "itemNumber" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "VariationInventory" DROP COLUMN "itemNumber",
ADD COLUMN     "itemNumber" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInventory_itemNumber_key" ON "GeneralInventory"("itemNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VariationInventory_itemNumber_key" ON "VariationInventory"("itemNumber");
