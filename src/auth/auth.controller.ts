import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
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
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() data: RegisterDTO) {
    const authData = await this.authService.register(data);
    return authData;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) data: LoginDTO) {
    const authData = await this.authService.login(data);
    return authData;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@UserId() userId: string) {
    const authData = await this.authService.getMe(userId);
    return authData;
  }
}
