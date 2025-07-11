import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string; // Pode ser email ou login do usuário

  @IsString()
  @MinLength(6)
  password: string;
}
