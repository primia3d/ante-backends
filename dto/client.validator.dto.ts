import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class ClientCreateDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber()
  contactNumber: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  address: string;
}
