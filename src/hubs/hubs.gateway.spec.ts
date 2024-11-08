import { Test, TestingModule } from '@nestjs/testing';
import { HubsGateway } from './hubs.gateway';

describe('HubsGateway', () => {
  let gateway: HubsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubsGateway],
    }).compile();

    gateway = module.get<HubsGateway>(HubsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
