import { Test, TestingModule } from '@nestjs/testing';
import { HubsGateway } from './hubs.gateway';
import { HubsService } from './hubs.service';
import { DrizzleService } from '@/db/drizzle.service';

describe('HubsGateway', () => {
  let gateway: HubsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubsGateway, HubsService, DrizzleService],
    }).compile();

    gateway = module.get<HubsGateway>(HubsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
