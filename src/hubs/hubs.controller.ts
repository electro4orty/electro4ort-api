import { AuthGuard } from '@/auth/auth.guard';
import { UserId } from '@/auth/user-id.decorator';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HubsService } from './hubs.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { CreateHubDTO, createHubSchema } from './dto/create-hub.dto';
import { RoomsService } from '@/rooms/rooms.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { env } from '@/utils/env';

@Controller('hubs')
@UseGuards(AuthGuard)
export class HubsController {
  constructor(
    private readonly hubsService: HubsService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post(':hubSlug/join')
  async joinHub(@Param('hubSlug') hubSlug: string, @UserId() userId: string) {
    const hub = await this.hubsService.joinHub(hubSlug, userId);
    return hub;
  }

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}_${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(new ZodValidationPipe(createHubSchema)) body: CreateHubDTO,
    @UserId() userId: string,
  ) {
    const avatar = files[0];
    const newHub = await this.hubsService.create(
      {
        name: body.name,
        avatar: `${env.APP_URL}/uploads/${avatar.filename}`,
      },
      userId,
    );
    return newHub;
  }

  @Get()
  async getAll(@Query('query') query: string, @UserId() userId: string) {
    const hubs = await this.hubsService.getAll(query, userId);
    return hubs;
  }

  @Get('joined')
  async getJoined(@UserId() userId: string) {
    const hubs = await this.hubsService.getJoinedHubs(userId);
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

  @Get(':hubSlug/rooms')
  async getRooms(@Param('hubSlug') hubSlug: string) {
    const hub = await this.hubsService.getOne(hubSlug);
    if (!hub) {
      throw new NotFoundException();
    }

    const hubRooms = await this.roomsService.findByHubId(hub.id);
    return hubRooms;
  }

  @Get(':hubSlug/participants')
  async getParticipants(@Param('hubSlug') hubSlug: string) {
    const hub = await this.hubsService.getOne(hubSlug);
    if (!hub) {
      throw new NotFoundException();
    }

    const hubParticipants = await this.hubsService.getParticipants(hub.id);
    return hubParticipants;
  }
}