import { Test, TestingModule } from '@nestjs/testing';
import { BoardLaneController } from './board-lane.controller';

describe('BoardLaneController', () => {
  let controller: BoardLaneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardLaneController],
    }).compile();

    controller = module.get<BoardLaneController>(BoardLaneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
