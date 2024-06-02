import { Test, TestingModule } from '@nestjs/testing';
import { UserOrgService } from './user-org.service';

describe('UserOrgService', () => {
  let service: UserOrgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOrgService],
    }).compile();

    service = module.get<UserOrgService>(UserOrgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
