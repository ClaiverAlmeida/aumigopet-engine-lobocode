import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  name?: string;
  profilePicture?: string;
  active?: boolean; // Só será aceito se o usuário autenticado for admin, platform_admin ou HR
  // Campos futuros: contato, endereço, etc.
}
