import {
  Body,
  Controller,
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

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body(new ZodValidationPipe(createRoomSchema)) data: CreateRoomDTO,
  ) {
    const newRoom = await this.roomsService.create(data);
    return newRoom;
  }

  @Get(':roomId')
  async findById(@Param('roomId') roomId: string) {
    const room = await this.roomsService.findById(roomId);
    if (!room) {
      throw new NotFoundException();
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
            createdAt: new Date(cursor.createdAt),
            id: cursor.id,
          }
        : undefined,
    );
    return messages;
  }
}
