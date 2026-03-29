
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(
      `Authorization Header: ${request.headers.authorization}`,
    );

    const token = this.extractTokenFromHeader(request);

    if (!token) {
        this.logger.warn('❌ No token found in Authorization header');
        throw new UnauthorizedException();
    }

    this.logger.debug(`✅ Extracted Token: ${token}`);

    try {
        const payload = await this.jwtService.verifyAsync(token);

        this.logger.debug(`✅ Token valid, user: ${JSON.stringify(payload)}`);

        request['user'] = payload;
    } catch (error) {
        this.logger.error('❌ Invalid token');
        throw new UnauthorizedException();
    }

    return true;
}

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
