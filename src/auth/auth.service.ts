import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/Register.dto';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {

        const user = await this.userService.getEmailById(registerDto.email);
        if (user) {
            throw new ConflictException("Email already exists;")
        }

        const saltRound = 10;
        const hashedPass = await bcrypt.hash(registerDto.password, saltRound)

        const newUser = await this.userService.registerUser({
            ...registerDto,
            password: hashedPass,
        })

        const payload = { id: newUser.id, email: newUser.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}