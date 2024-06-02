import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class AccountLoginDTO {
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}