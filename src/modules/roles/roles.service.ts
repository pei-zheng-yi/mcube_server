import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Like, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, TRoleQuery } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    console.log(createRoleDto);
    const role = plainToClass(Role, createRoleDto);
    const existRole = await this.roleRepository.countBy({ roleValue: role.roleValue });
    if (existRole > 0) {
      throw new HttpException('已存在角色', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.roleRepository.save(role);
      return { data: null, message: '新增成功' };
    } catch (error) {
      throw new HttpException('新增失败', HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
    }
  }

  async findAll(query: TRoleQuery) {
    const [roles, count] = await this.roleRepository.findAndCount({
      where: {
        roleName: query.roleName ? Like(`%${query.roleName}%`) : undefined,
        status: query.status ? +query.status : undefined,
      },
    });
    return {
      data: {
        list: roles,
        count,
      },
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    return role || { data: null, message: '角色不存在' };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const existRole = await this.roleRepository.findOneBy({ id });
    if (!existRole) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    }
    if (existRole) {
      Object.keys(updateRoleDto).forEach((key) => {
        existRole[key] = updateRoleDto[key];
      });

      try {
        await this.roleRepository.save(existRole);
        return {
          data: null,
          message: '修改成功',
        };
      } catch (error) {
        throw new HttpException('修改失败', HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
      }
    }
  }

  async remove(id: number) {
    try {
      await this.roleRepository.softDelete({ id });
      return {
        data: null,
        message: '删除成功',
      };
    } catch (error) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }
}
