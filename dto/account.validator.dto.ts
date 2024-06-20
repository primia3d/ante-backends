import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AccountGetDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}

export class AccountDeleteDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}

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
  readonly roleID: string;

  @IsOptional()
  readonly parentAccountId?: string;

  @IsOptional()
  readonly image?: string;
}

export class AccountUpdateDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

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
  password: string;

  @IsNotEmpty()
  readonly roleID: string;

  @IsOptional()
  readonly parentAccountId?: string;
}
