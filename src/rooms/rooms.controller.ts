import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { CreateRoomDTO, createRoomSchema } from './dto/create-room.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { MessagesService } from '@/messages/messages.service';
import { UserId } from '@/auth/user-id.decorator';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly hubsService: RoomsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createRoomSchema)) data: CreateRoomDTO,
  ) {
    const newRoom = await this.roomsService.create(data);
    return newRoom;
  }

  @Get(':roomId')
  async findById(@Param('roomId') roomId: string, @UserId() userId: string) {
    const room = await this.roomsService.findById(roomId);
    if (!room) {
      throw new NotFoundException();
    }

    const hasJoined = await this.hubsService.checkHasJoined(room.hubId, userId);
    if (!hasJoined) {
      throw new ForbiddenException();
    }

    return room;
  }

  @Get(':roomId/messages')
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @Query('cursor') cursorParam: string | undefined,
  ) {
    const cursor = cursorParam
      ? (JSON.parse(cursorParam) as { createdAt: string; id: string })
      : undefined;
    const messages = await this.messagesService.getRoomMessages(
      roomId,
      cursor
        ? {
            createdAt: cursor.createdAt,
            id: cursor.id,
          }
        : undefined,
    );
    return messages;
  }

  @Get(':roomId/missed-messages')
  async getMissedRoomMessages(
    @Param('roomId') roomId: string,
    @Query('cursor') cursorParam: string,
  ) {
    const cursor = JSON.parse(cursorParam) as { createdAt: string };
    const messages = await this.messagesService.getMissedRoomMessages(
      roomId,
      cursor,
    );
    return messages;
  }
}
