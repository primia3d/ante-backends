import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'lib/prisma.service';
import { UtilityService } from 'lib/utility.service';
import { TableHandlerService } from 'lib/table.handler/table.handler.service';
import {
  BoardLaneCreateDto,
  BoardLaneOrderDto,
  ReorderSingleLaneDto,
  BoardLaneUpdateDto,
  BoardLaneDeleteDto,
} from 'dto/board-lane.validator.dto';
import {
  BoardLaneInterface,
  BoardLaneResponseInterface,
} from 'interfaces/boardLane.interface';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CustomWsException } from 'filters/custom-ws.exception';
import { TaskInterface } from 'interfaces/task.interface';
import { defaultBoardLaneData } from 'reference/defaultBoardLanes.reference';
@Injectable()
export class BoardLaneService {
  @Inject() public utilityService: UtilityService;
  @Inject() public prisma: PrismaService;
  @Inject() public tableHandlerService: TableHandlerService;

  /**
   * Creates a new board lane.
   * @param boardLaneDto - The data for the new board lane.
   * @returns The newly created board lane
   */
  async createBoardLane(boardLaneDto: BoardLaneCreateDto) {
    const boardLaneCreateDtoInstance = plainToClass(
      BoardLaneCreateDto,
      boardLaneDto,
    );

    const errors = await validate(boardLaneCreateDtoInstance);
    if (errors.length > 0)
      throw new CustomWsException(
        400,
        'Validation failed',
        'VALIDATION_FAILED',
      );

    const createBoardLaneData: Prisma.BoardLaneCreateInput = {
      name: boardLaneDto.name,
      order: await this.calculateNextOrder(),
      description: boardLaneDto.description,
    };

    const createResponse = await this.prisma.boardLane.create({
      data: createBoardLaneData,
    });

    return createResponse;
  }

  /**
   * Reorders the board lanes based on the input.
   * @param input - The input object containing either 'names' for multiple lanes or 'name' and 'newPosition' for a single lane.
   * @returns A formatted response object containing a success message and the reordered board lane(s).
   */
  async reorderBoardLanes(input: BoardLaneOrderDto | ReorderSingleLaneDto) {
    if ('names' in input) {
      await this.reorderMultipleLanes(input);
      return this.utilityService.formatData(
        { message: 'Lanes reordered successfully' },
        'boardLane',
      );
    } else {
      await this.reorderSingleLane(input);
      return this.utilityService.formatData(
        { message: 'Lane reordered successfully' },
        'boardLane',
      );
    }
  }

  private async calculateNextOrder(): Promise<number> {
    const boardLanes = await this.prisma.boardLane.findMany({
      orderBy: {
        order: 'desc',
      },
      take: 1,
    });
    return (boardLanes[0]?.order ?? 0) + 1;
  }
  private async reorderMultipleLanes(input: BoardLaneOrderDto) {
    const names = input.names;
    for (let i = 0; i < names.length; i++) {
      const boardLane = await this.prisma.boardLane.findUnique({
        where: { name: names[i] },
      });

      if (!boardLane) {
        throw new Error(`BoardLane with name ${names[i]} not found.`);
      }

      await this.prisma.boardLane.update({
        where: { id: boardLane.id },
        data: { order: i + 1 },
      });
    }
  }
  private async reorderSingleLane(input: ReorderSingleLaneDto) {
    const { name, newPosition } = input;
    const laneToMove = await this.prisma.boardLane.findUnique({
      where: { name },
    });

    if (!laneToMove) {
      throw new NotFoundException(`Lane with name ${name} not found.`);
    }

    await this.prisma.boardLane.updateMany({
      where: { order: { gte: newPosition } },
      data: { order: { increment: 1 } },
    });

    await this.prisma.boardLane.update({
      where: { id: laneToMove.id },
      data: { order: newPosition },
    });
  }

  async getBoardLanes(
    projectId: number,
  ): Promise<{ boardLane: BoardLaneInterface; items: TaskInterface[] }[]> {
    const tasks = await this.prisma.task.findMany({
      where: { isDeleted: false, projectId: projectId },
      orderBy: {
        order: 'asc',
      },
    });

    const groupedTasks = tasks.reduce((acc, task) => {
      const boardLaneId = task.boardLaneId;
      if (!acc[boardLaneId]) {
        acc[boardLaneId] = [];
      }
      acc[boardLaneId].push(task);
      return acc;
    }, {});

    const boardLanes = await this.prisma.boardLane.findMany({
      where: { isDeleted: false },
      orderBy: {
        order: 'asc',
      },
    });

    const result = boardLanes.map((boardLane) => ({
      boardLane,
      items: groupedTasks[boardLane.id] || [],
    }));

    return result;
  }

  async updateBoardLaneInformation(boardLaneUpdateDto: BoardLaneUpdateDto) {
    const boardLaneUpdateDtoInstance = plainToClass(
      BoardLaneUpdateDto,
      boardLaneUpdateDto,
    );

    const errors = await validate(boardLaneUpdateDtoInstance);
    if (errors.length > 0)
      throw new CustomWsException(
        400,
        'Validation failed',
        'VALIDATION_FAILED',
      );
    const updateBoardLaneData: Prisma.BoardLaneUpdateInput = {
      name: boardLaneUpdateDto.name,
      description: boardLaneUpdateDto.description,
    };
    const updateResponse = await this.prisma.boardLane.update({
      where: { id: boardLaneUpdateDto.id },
      data: updateBoardLaneData,
    });

    return updateResponse;
  }

  /**
   * Deletes a board lane by its ID.
   * @param boardLaneDeleteDto - The data containing the ID of the board lane to be deleted.
   * @returns A formatted response object containing a success message and the deleted board lane.
   */
  async deleteBoardLane(boardLaneDeleteDto: BoardLaneDeleteDto) {
    const boardLaneDeleteDtoInstance = plainToClass(
      BoardLaneDeleteDto,
      boardLaneDeleteDto,
    );

    const errors = await validate(boardLaneDeleteDtoInstance);
    if (errors.length > 0)
      throw new CustomWsException(
        400,
        'Validation failed',
        'VALIDATION_FAILED',
      );

    const deleteResponse = await this.prisma.boardLane.update({
      where: { id: boardLaneDeleteDto.id },
      data: { isDeleted: true },
    });
    return deleteResponse;
  }

  async boardLaneTable(query: TableQueryDTO, body: TableBodyDTO) {
    this.tableHandlerService.initialize(query, body, 'boardLane');
    const tableQuery = this.tableHandlerService.constructTableQuery();
    const {
      list: baseList,
      currentPage,
      pagination,
    } = await this.tableHandlerService.getTableData(
      this.prisma.boardLane,
      query,
      tableQuery,
    );

    const list = await this.utilityService.mapFormatData(baseList, 'boardLane');

    return { list, pagination, currentPage };
  }

  async getBoardLaneById({ id }) {
    const intId = parseInt(id, 10);

    const boardLaneInformation = await this.prisma.boardLane.findFirst({
      where: { id: intId },
    });

    if (!boardLaneInformation) {
      throw new NotFoundException('Board lane information not found');
    }

    return this.utilityService.formatData(boardLaneInformation, 'boardLane');
  }

  async reOrderBoardLanes(containerArray): Promise<void> {
    await Promise.all(
      containerArray.map(async (item, index) => {
        const newOrder = index + 1;

        const boardLane = await this.prisma.boardLane.findUnique({
          where: { id: item.id },
        });

        if (!boardLane) {
          throw new Error(`BoardLane with id ${item.id} not found.`);
        }

        await this.prisma.boardLane.update({
          where: { id: boardLane.id },
          data: { order: newOrder },
        });
      }),
    );
  }

  async checkIfBoardLaneExists(boardLaneId: number): Promise<boolean> {
    const boardLaneInformation = await this.prisma.boardLane.findUnique({
      where: { id: boardLaneId },
    });

    return !!boardLaneInformation;
  }
}
