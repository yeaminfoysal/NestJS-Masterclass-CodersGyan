import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getEmailById(email: string) {
        return {
            email,
            message: "user service source"
        }
    }
}
