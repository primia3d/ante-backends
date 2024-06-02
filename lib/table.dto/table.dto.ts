import { IsBoolean, IsDecimal, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
export class TableQueryDTO {
    @IsNotEmpty()
    readonly page: number;

    @IsNotEmpty()
    readonly perPage: number;

    readonly search?: string;
}

export class TableBodyDTO {
    readonly filter: number;
}