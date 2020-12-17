import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interfaces/user.interface';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async create(userData: CreateUserDto): Promise<UserResponse> {
    const newUser = this.userRepository.create(userData);
    newUser.password = await this.hashPassword(userData.password);
    return newUser.save();
  }

  public async update(id: string, userData: UpdateUserDto): Promise<any> {
    const user = this.findOne(id);
    if (user) {
      return await this.userRepository.update(id, userData);
    }
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) return user;

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async checkByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) return user;

    return null;
  }

  private async hashPassword(passwordInPlaintext): Promise<string> {
    return await bcrypt.hash(passwordInPlaintext, 10);
  }
}
