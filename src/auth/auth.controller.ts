import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/Register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
