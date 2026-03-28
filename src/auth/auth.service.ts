import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/Register.dto';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {

        const user = await this.userService.getUserByEmail(registerDto.email);
        if (user) {
            throw new ConflictException("Email already exists;")
        }

        const saltRound = 10;
        const hashedPass = await bcrypt.hash(registerDto.password, saltRound)

        const newUser = await this.userService.registerUser({
            ...registerDto,
            password: hashedPass,
        })
        this.logger.log(`New user registered with email: ${newUser.email}`);

        const payload = { id: newUser.id, email: newUser.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.getUserByEmail(loginDto.email);
        if(!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { id: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };

    }
}