import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseRecord } from '@app/src/common/entities/baseRecord';
import { IsPhoneNumber } from 'class-validator';

import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User extends BaseRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  @IsPhoneNumber('CN')
  phone: string;

  @Column({ type: 'json' })
  @ManyToMany(() => Role, (role) => role.user, { eager: true })
  roles: Role[];

  @Column()
  status: number;

  @Column({ nullable: true })
  @Exclude()
  password: string;
}
