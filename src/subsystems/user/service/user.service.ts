import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { BaseService } from 'src/common/services/base.service';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { mapToDto } from 'src/common/utils/global-functions.utils';
import { UpdateUserDto } from '../dto/update-user.dto';

export class UserService extends BaseService<User> {

  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  protected getRepositoryName(): string {
    return 'users';
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { ...restOfDto } = createUserDto;
    let user: User = await this.repository.create({
      ...restOfDto,

    });
    user = await this.repository.save(user);
    // Mapea el objeto User a UserDto
    const userDto = mapToDto(user, UserDto);
    return userDto;
  }

  getUsers(): Promise<User[]> {
    return this.findAll();
  }

  async findUserById(id: number): Promise<UserDto> {
    let user = await this.repository.findOne({
      where: { id: id, deleted_at: null },
      relations: ['roles', 'roles.permissions'],
    });
    //let user = await this.findOneById(id)

    // Mapea el objeto User a UserDto
    const userDto = mapToDto(user, UserDto);

    return userDto;
  }

  findOneByEmail(email: any): Promise<User> {
    return this.repository.findOne({
      where: {
        email: email,
        deleted_at: null, // Excluir registros eliminados lógicamente
      },
      select: ['password'], // Incluir explícitamente el campo password
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {

    const { ...restOfDto } = updateUserDto;

    let updatedUser = await this.update(id, restOfDto as unknown as Partial<User>);
    // Mapea el objeto User a UserDto
    return mapToDto(updatedUser, UserDto);

  }

  deleteUser(id: number): Promise<{ affected?: number }> {
    return this.delete(id); // Utiliza el método delete de BaseService
  }

  findOneByEmailWithPassword(email: string) {
    return this.repository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password'],
    });

  }

}
