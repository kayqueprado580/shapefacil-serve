import { UserAccess } from '../entities/userAccess.entity';
import { IsNotEmpty } from 'class-validator';

export class UserAccessDTO extends UserAccess {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  access: string;

  userId?: number;
}
