import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
export class AccountCreateDTO {
    @IsNotEmpty()
    readonly firstName: string;

    @IsNotEmpty()
    readonly lastName: string;

    @IsNotEmpty()
    readonly contactNumber: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly developerKey: string;

    readonly key:any;
}