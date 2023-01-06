import { BaseRecord } from '@app/src/common/entities/baseRecord';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role extends BaseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', comment: '角色名' })
  @IsString()
  roleName: string;

  @Column({ type: 'text', comment: '角色值' })
  @IsString()
  roleValue: string;

  @Column({ type: 'int', default: 1, comment: '排序' })
  orderNo: number;

  @Column({ default: 1, type: 'tinyint', comment: '状态，0:禁用， 1:普通' })
  status: RoleStatus;

  @Column({ type: 'text', nullable: true, comment: '备注信息' })
  remark: string;
}

export enum RoleStatus {
  DISABLE = 0, // 禁用
  NORMAL = 1, // 普通
}

export type TRoleQuery = Pick<Role, 'roleName' | 'status'>;
