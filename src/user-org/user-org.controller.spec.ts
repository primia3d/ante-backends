import { Test, TestingModule } from '@nestjs/testing';
import { UserOrgController } from './user-org.controller';

describe('UserOrgController', () => {
  let controller: UserOrgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOrgController],
    }).compile();

    controller = module.get<UserOrgController>(UserOrgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
