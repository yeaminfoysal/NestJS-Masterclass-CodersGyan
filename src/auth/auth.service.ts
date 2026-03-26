import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/Register.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    register(registerDto: RegisterDto) {

        const user = this.userService.getEmailById(registerDto.email);

        return user;
    }
}