import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RoleGetDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
export class RoleParentDTO {
  @IsNotEmpty()
  @IsString()
  readonly roleGroupId: string;
}

export class RoleDeleteDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}

export class RoleCreateDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  readonly scopeIDs: string[];

  @IsNotEmpty()
  @IsString()
  readonly roleGroupId: string;

  @IsOptional()
  @IsString()
  readonly parentRoleId?: string;
}

export class RoleUpdateDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
