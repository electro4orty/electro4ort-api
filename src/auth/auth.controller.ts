import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/zod-validation/zod-validation.pipe';
import { RegisterDTO, registerSchema } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDTO, loginSchema } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { UserId } from './user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) data: RegisterDTO,
  ) {
    const newUser = await this.authService.register(data);
    if (!newUser) {
      throw new BadRequestException();
    }

    return newUser;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) data: LoginDTO) {
    const user = await this.authService.login(data);
    if (!user) {
      throw new BadRequestException();
    }

    return {
      user: user,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@UserId() userId: number) {
    return userId;
  }
}
