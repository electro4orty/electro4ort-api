import { env } from '@/utils/env';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const contextType = context.getType();

    if (contextType === 'http') {
      const req = context.switchToHttp().getRequest<Request>();
      const token = this.parseToken(req.headers.authorization ?? '');
      if (!token) {
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwtService.verifyAsync<{ userId: number }>(
          token,
          {
            secret: env.JWT_SECRET,
          },
        );
        req.userId = payload.userId;

        return true;
      } catch (error) {
        throw new UnauthorizedException(error);
      }
    } else if (contextType === 'ws') {
      const wsContext = context.switchToWs();
      const wsClient = wsContext.getClient();
      const authHeader = wsClient.handshake.auth.token;
      const token = this.parseToken(authHeader);
      if (!token) {
        throw new WsException('Unauthorized');
      }

      try {
        await this.jwtService.verifyAsync<{ userId: number }>(token, {
          secret: env.JWT_SECRET,
        });

        return true;
      } catch (error) {
        throw new WsException(error as Error);
      }
    }

    return false;
  }

  private parseToken(authHeader: string) {
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
