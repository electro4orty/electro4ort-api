import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { UsersService } from '@/users/users.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(data: RegisterDTO) {
    try {
      return await this.usersService.create(data);
    } catch {
      return null;
    }
  }

  async login(data: LoginDTO) {
    return await this.usersService.findByUsername(data.username);
  }
}
