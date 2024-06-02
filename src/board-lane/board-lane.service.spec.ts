import { Test, TestingModule } from '@nestjs/testing';
import { BoardLaneService } from './board-lane.service';

describe('BoardLaneService', () => {
  let service: BoardLaneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardLaneService],
    }).compile();

    service = module.get<BoardLaneService>(BoardLaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
