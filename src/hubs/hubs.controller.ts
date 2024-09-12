import { AuthGuard } from '@/auth/auth.guard';
import { UserId } from '@/auth/user-id.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  async joinHub(
    @Param('hubId', ParseIntPipe) hubId: number,
    @UserId() userId: number,
  ) {
    const participant = await this.hubsService.joinHub(hubId, userId);
    return participant;
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @UserId() userId: number,
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

  @Get('joined')
  @UseGuards(AuthGuard)
  async getJoined(@UserId() userId: number) {
    const hubs = await this.hubsService.getJoinedHubs(userId);
    return hubs;
  }

  @Get(':hubId/rooms')
  async getRooms(@Param('hubId', ParseIntPipe) hubId: number) {
    const hubRooms = await this.roomsService.findByHubId(hubId);
    return hubRooms;
  }
}
