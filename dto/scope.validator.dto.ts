import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
  IsEmpty
} from 'class-validator';

export class ScopeTreeDTO {
  readonly roleID: string;
}

export class ScopeListDTO {
  readonly roleGroupId: string;
}