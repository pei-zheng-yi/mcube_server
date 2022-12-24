import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
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

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async find(userName) {
    return this.users.find((user) => user.userName === userName);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
