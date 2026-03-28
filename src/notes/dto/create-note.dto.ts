import { IsString, isString } from "class-validator";

export class CreateNoteDto {

    @IsString()
    title!: string;

    @IsString()
    body!: string;
}
