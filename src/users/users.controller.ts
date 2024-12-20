import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { UpdateUserDTO, updateUserSchema } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
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

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
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
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    };
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

  @Post(':userId/push-config')
  async pushConfig(@Param('userId') userId: string, @Body() data: object) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const updatedUser = await this.usersService.savePushSubscription(
      userId,
      data,
    );

    return updatedUser;
  }
}
