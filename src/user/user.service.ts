import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/Register.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private PrismaService: PrismaService) { }

    async getEmailById(email: string) {
        const user = await this.PrismaService.user.findFirst(
            { where: { email: email } }
        )
        return user;
    }

    async registerUser(registerDto: RegisterDto) {
        const user = await this.PrismaService.user.create(
            { data: registerDto }
        );
        return user
    }
}
