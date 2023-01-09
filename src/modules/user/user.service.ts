import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}
  private readonly users = [
    {
      userId: 1,
      userName: '章三',
      password: '123456',
      age: 18,
    },
    {
      userId: 2,
      userName: '李四',
      password: '123456',
      age: 20,
    },
  ];

  async regist(createUserDto: Partial<CreateUserDto>) {
    const existingUser = await this.userRepository
      .createQueryBuilder()
      .where({ email: createUserDto.email })
      .orWhere({ phone: createUserDto.phone })
      .withDeleted()
      .getExists();

    if (existingUser) {
      throw new HttpException('邮箱已注册', HttpStatus.BAD_REQUEST);
    }
    const user = new User();
    const roles = await this.roleRepository.find({ where: { id: In(createUserDto.roles) } });
    console.log(roles);
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.nickName = createUserDto.name;
    user.roles = roles;
    user.status = 1;
    await this.userRepository.save(user);
    return {
      data: user,
      message: '注册成功',
    };
  }

  async findOneByName(userName) {
    return this.users.find((user) => user.userName === userName);
  }

  async findAll() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .addSelect(['role.id', 'role.roleName', 'role.roleValue'])
      .getManyAndCount();
    const [list, count] = users;
    return {
      data: {
        list: instanceToPlain(list),
        count,
      },
      message: '查询成功',
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id })
      .leftJoin('user.roles', 'role')
      .addSelect(['role.id', 'role.roleName', 'role.roleValue'])
      .getOne();
    if (user) {
      return instanceToPlain(user);
    }
    return null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    Object.keys(updateUserDto).forEach(async (key) => {
      if (key !== 'roles') {
        existingUser[key] = updateUserDto[key];
      } else {
        const roles = await this.roleRepository.find({ where: { id: In(updateUserDto.roles) } });
        if (!roles || !roles.length) {
          throw new HttpException('角色不存在，请检查角色', HttpStatus.BAD_REQUEST);
        }
        existingUser.roles = roles;
      }
    });

    try {
      await this.userRepository.save(existingUser);
      return {
        data: null,
        message: '修改成功',
      };
    } catch (error) {
      throw new HttpException('修改失败', HttpStatus.INTERNAL_SERVER_ERROR, { cause: error.message });
    }
  }

  async remove(id: number) {
    const existing = await this.userRepository.findOneBy({ id });
    if (existing) {
      await this.userRepository.softRemove(existing);
      return { data: null, message: '删除成功' };
    } else {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
  }
}
