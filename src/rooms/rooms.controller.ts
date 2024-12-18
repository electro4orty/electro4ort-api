import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { CreateRoomDTO, createRoomSchema } from './dto/create-room.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { MessagesService } from '@/messages/messages.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
            createdAt: new Date(cursor.createdAt),
            id: cursor.id,
          }
        : undefined,
    );
    return messages;
  }

  @Post(':roomId/files')
  @UseInterceptors(
    FilesInterceptor('files', 99, {
      limits: {
        fieldSize: 1e6 * 5,
        fileSize: 1e6 * 5,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}_${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    }));
  }
}
