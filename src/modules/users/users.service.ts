import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    const users = this.repo.find();
    return users;
  }

  async create(data: CreateUserDto) {
    const user = this.repo.create(data);

    return this.repo.save(user);
  }

  async findById(id: number) {
    if (!id) {
      throw new NotFoundException("could't find the user");
    }
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.repo.findOneBy({ username });
    return user;
  }

  async deleteById(id: number) {
    const user = await this.findById(id);
    return this.repo.remove(user);
  }

  async update(id: number, userData: Partial<User>) {
    const user = await this.findById(id);
    Object.assign(user, userData);
    return this.repo.save(user);
  }

  async checkUniqueness(email: string, username: string) {
    // check if email exists

    const isEmailExists = await this.findByEmail(email);
    if (isEmailExists) throw new BadRequestException('email is already in use');

    const isUsernameExists = await this.findByUsername(username);
    if (isUsernameExists)
      throw new BadRequestException('username is already in use');
  }
}
