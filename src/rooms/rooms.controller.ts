import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { CreateRoomDTO, createRoomSchema } from './dto/create-room.dto';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body(new ZodValidationPipe(createRoomSchema)) data: CreateRoomDTO,
  ) {
    const newRoom = await this.roomsService.create(data);
    return newRoom;
  }

  @Get(':roomId')
  async findById(@Param('roomId', ParseIntPipe) roomId: number) {
    const room = await this.roomsService.findById(roomId);
    if (!room) {
      throw new NotFoundException();
    }

    return room;
  }
}
