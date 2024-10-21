import { AuthGuard } from '@/auth/auth.guard';
import { UserId } from '@/auth/user-id.decorator';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HubsService } from './hubs.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { CreateHubDTO, createHubSchema } from './dto/create-hub.dto';
import { RoomsService } from '@/rooms/rooms.service';

@Controller('hubs')
export class HubsController {
  constructor(
    private readonly hubsService: HubsService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post(':hubId/join')
  @UseGuards(AuthGuard)
  async joinHub(@Param('hubId') hubId: string, @UserId() userId: string) {
    const participant = await this.hubsService.joinHub(hubId, userId);
    return participant;
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @UserId() userId: string,
    @Body(new ZodValidationPipe(createHubSchema)) data: CreateHubDTO,
  ) {
    const newHub = await this.hubsService.create(data, userId);
    return newHub;
  }

  @Get()
  async getAll() {
    const hubs = await this.hubsService.getAll();
    return hubs;
  }

  @Get(':hubSlug')
  async getOne(@Param('hubSlug') hubSlug: string) {
    const hub = await this.hubsService.getOne(hubSlug);
    if (!hub) {
      throw new NotFoundException();
    }
    return hub;
  }

  @Get('joined')
  @UseGuards(AuthGuard)
  async getJoined(@UserId() userId: string) {
    const hubs = await this.hubsService.getJoinedHubs(userId);
    return hubs;
  }

  @Get(':hubId/rooms')
  async getRooms(@Param('hubId') hubId: string) {
    const hubRooms = await this.roomsService.findByHubId(hubId);
    return hubRooms;
  }
}
