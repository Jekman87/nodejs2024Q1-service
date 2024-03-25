import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { DatabaseService } from 'src/database/database.service';
import { v4 } from 'uuid';

const DB_KEY = 'users';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const timestamp = new Date().getTime();

    const newUser: User = {
      id: v4(),
      ...createUserDto,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const user = await this.databaseService.create(DB_KEY, newUser);

    return new User(user);
  }

  async findAll() {
    const users = await this.databaseService.findAll(DB_KEY);

    return users.map((user) => new User(user));
  }

  async findOne(id: string) {
    const user = await this.databaseService.findOne(DB_KEY, id);

    if (!user) throw new NotFoundException('User not found');

    return new User(user);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto;

    const user = await this.databaseService.findOne(DB_KEY, id);

    if (!user) throw new NotFoundException('User not found');

    if (oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const dataForUpdate = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    };

    const updatedUser = await this.databaseService.update(
      DB_KEY,
      id,
      dataForUpdate,
    );

    return new User(updatedUser);
  }

  async remove(id: string) {
    const isRemoved = await this.databaseService.remove(DB_KEY, id);

    if (!isRemoved) throw new NotFoundException('User not found');

    return isRemoved;
  }
}
