import { IsString } from 'class-validator';
import { RoleStatus } from '../entities/role.entity';

export class CreateRoleDto {
  @IsString()
  readonly roleName: string;

  @IsString()
  readonly roleValue: string;

  readonly orderNo?: number;
  readonly status?: RoleStatus;
  readonly remark?: string;
}
