import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { UsersService } from '@/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDTO) {
    const existingUser = await this.usersService.findByUsername(data.username);
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }

    const user = await this.usersService.create(data);
    const token = await this.jwtService.signAsync({
      userId: user.id,
    });

    return {
      user,
      token,
    };
  }

  async login(data: LoginDTO) {
    const user = await this.usersService.findByUsername(data.username);
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const token = await this.jwtService.signAsync({
      userId: user.id,
    });

    return {
      user,
      token,
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const token = await this.jwtService.signAsync({
      userId: user.id,
    });

    return {
      user,
      token,
    };
  }
}
