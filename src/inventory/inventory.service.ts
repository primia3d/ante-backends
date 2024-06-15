import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "lib/prisma.service";
import { UtilityService } from "lib/utility.service";
import { CreateGeneralInventoryDTO } from "dto/general-inventory.create.dto";
import { TableHandlerService } from "lib/table.handler/table.handler.service";
import { TableBodyDTO, TableQueryDTO } from "lib/table.dto/table.dto";

@Injectable()
export class InventoryService {
  @Inject() public prisma: PrismaService;
  @Inject() public utility: UtilityService;
  @Inject() public tableHandler: TableHandlerService;

  async getGeneralInventoryList(
    query: TableQueryDTO,
    body: TableBodyDTO,
    warehouseId: string
  ) {
    this.tableHandler.initialize(query, body, "generalInventory");
    const tableQuery = this.tableHandler.constructTableQuery();

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException("Warehouse not found");
    }

    tableQuery["select"] = {
      id: true,
      itemNumber: true,
      description: true,
      location: true,
    };

    tableQuery["where"] = {
      AND: [{ isDeleted: false }, { warehouseId: warehouseId }],
    };

    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandler.getTableData(
      this.prisma.generalInventory,
      query,
      tableQuery
    );

    const list = await this.utility.mapFormatData(baseList, "generalInventory");
    return { list, pagination, currentPage };
  }
  async searchGeneralInventoryList(
    query: TableQueryDTO,
    body: TableBodyDTO,
    warehouseId: string
  ) {
    this.tableHandler.initialize(query, body, "generalInventory");
    const tableQuery = this.tableHandler.constructTableQuery();

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException("Warehouse not found");
    }

    if (query.search) {
      tableQuery["where"] = {
        AND: [
          tableQuery["where"],
          { isDeleted: false },
          { warehouseId: warehouseId },
          {
            OR: [
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          },
        ],
      };
    }

    tableQuery["where"] = {
      ...tableQuery["where"],
      warehouseId: warehouseId,
    };
    tableQuery["select"] = {
      id: true,
      itemNumber: true,
      description: true,
      location: true,
    };
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandler.getTableData(
      this.prisma.generalInventory,
      query,
      tableQuery
    );

    const list = await this.utility.mapFormatData(baseList, "generalInventory");
    return { list, pagination, currentPage };
  }
  async getVariantInventoryList(
    query: TableQueryDTO,
    body: TableBodyDTO,
    generalInventoryId: string
  ) {
    this.tableHandler.initialize(query, body, "variantInventory");
    const tableQuery = this.tableHandler.constructTableQuery();

    const generalInventory = await this.prisma.generalInventory.findUnique({
      where: { id: generalInventoryId },
    });
    if (!generalInventory) {
      throw new NotFoundException("General Inventory not found");
    }

    tableQuery["select"] = {
      id: true,
      variationName: true,
      variationDescription: true,
      stocks: true,
      unitOfMeasure: true,
      unitPrice: true,
      total: true,
    };

    tableQuery["where"] = {
      AND: [{ isDeleted: false }, { generalInventoryId: generalInventoryId }],
    };

    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandler.getTableData(
      this.prisma.variationInventory,
      query,
      tableQuery
    );

    const list = await this.utility.mapFormatData(baseList, "variantInventory");
    return { list, pagination, currentPage };
  }
  async searchVariantInventoryList(
    query: TableQueryDTO,
    body: TableBodyDTO,
    generalInventoryId: string
  ) {
    this.tableHandler.initialize(query, body, "variantInventory");
    const tableQuery = this.tableHandler.constructTableQuery();

    const generalInventory = await this.prisma.generalInventory.findUnique({
      where: { id: generalInventoryId },
    });
    if (!generalInventory) {
      throw new NotFoundException("General Inventory not found");
    }

    if (query.search) {
      tableQuery["where"] = {
        AND: [
          tableQuery["where"],
          { isDeleted: false },
          { generalInventoryId: generalInventoryId },
          {
            OR: [
              {
                variationName: { contains: query.search, mode: "insensitive" },
              },
            ],
          },
        ],
      };
    }
    tableQuery["select"] = {
      id: true,
      variationName: true,
      variationDescription: true,
      stocks: true,
      unitOfMeasure: true,
      unitPrice: true,
      total: true,
    };
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandler.getTableData(
      this.prisma.variationInventory,
      query,
      tableQuery
    );

    const list = await this.utility.mapFormatData(baseList, "variantInventory");
    return { list, pagination, currentPage };
  }
  async createInventory(
    createGeneralInventoryDTO: CreateGeneralInventoryDTO,
    warehouseId: string
  ) {
    const { description, variations} = createGeneralInventoryDTO;
    const accountInformation = this.utility.accountInformation;

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException("Warehouse not found");
    }

    this.validateCreateGeneralInventoryDTO(createGeneralInventoryDTO);

    const latestGeneralInventory = await this.prisma.generalInventory.findFirst(
      {
        orderBy: { itemNumber: "desc" },
      }
    );
    const newItemNumber = latestGeneralInventory
      ? latestGeneralInventory.itemNumber + 1
      : 1;

    const createdGeneralInventory = await this.prisma.generalInventory.create({
      data: {
        itemNumber: newItemNumber,
        description,
        warehouseId: warehouseId,
        location: warehouse.name,
        createdById: accountInformation.id,
        updatedById: accountInformation.id,
      },
    });

    const variantInventoryData = variations.map((variant, index) => {
      const {
        variationName,
        variationDescription,
        stocks,
        unitOfMeasure,
        unitPrice,
      } = variant;
      const itemNumber = parseFloat(`${newItemNumber}.${index + 1}`);
      const total = unitPrice * stocks;
      return {
        itemNumber,
        variationName,
        variationDescription,
        stocks,
        unitOfMeasure,
        unitPrice,
        total,
        generalInventoryId: createdGeneralInventory.id,
        createdById: accountInformation.id,
        updatedById: accountInformation.id,
      };
    });

    await this.prisma.variationInventory.createMany({
      data: variantInventoryData as Prisma.VariationInventoryCreateManyInput[],
    });

    const formattedGeneralInventory = this.utility.formatData(
      createdGeneralInventory,
      "generalInventory"
    );
    const formattedVariants = this.utility.mapFormatData(
      variations,
      "variantInventory"
    );

    const responseData = {
      data: {
        generalInventory: formattedGeneralInventory,
        variants: formattedVariants,
      },
    };

    return responseData;
  }

  private validateCreateGeneralInventoryDTO(
    createGeneralInventoryDTO: CreateGeneralInventoryDTO
  ) {
    const { description, variations, location } = createGeneralInventoryDTO;

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      throw new BadRequestException("Invalid description");
    }
    if (
      !location ||
      typeof location !== "string" ||
      location.trim() === ""
    ) {
      throw new BadRequestException("Invalid location");
    }
  
    
    if (!variations || !Array.isArray(variations) || variations.length === 0) {
      throw new BadRequestException("At least one variant inventory is required.");
    }
    variations.forEach((variant) => {
      if (
        !variant.variationName ||
        typeof variant.variationName !== "string" ||
        variant.variationName.trim() === ""
      ) {
        throw new BadRequestException("Invalid variation name");
      }
      if (
        !variant.variationDescription ||
        typeof variant.variationDescription !== "string" ||
        variant.variationDescription.trim() === ""
      ) {
        throw new BadRequestException("Invalid variation description");
      }
      if (typeof variant.stocks !== "number" || variant.stocks < 0) {
        throw new BadRequestException("Invalid stocks value");
      }
      if (
        !variant.unitOfMeasure ||
        typeof variant.unitOfMeasure !== "string" ||
        variant.unitOfMeasure.trim() === ""
      ) {
        throw new BadRequestException("Invalid unit of measure");
      }
      if (typeof variant.unitPrice !== "number" || variant.unitPrice < 0) {
        throw new BadRequestException("Invalid unit price");
      }
    });
  }
}
