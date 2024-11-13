import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { UpdateUserDTO, updateUserSchema } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async getOne(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDTO,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const updatedUser = await this.usersService.update(user.id, body);

    return updatedUser;
  }
}
