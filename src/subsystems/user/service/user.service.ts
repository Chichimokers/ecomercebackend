import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from "../dto";
import { BaseService } from "../../../common/services/base.service";
import { User } from '../entities/user.entity';
import { UserDto } from "../dto";
import { mapToDto } from "../../../common/utils/global-functions.utils";
import { UpdateUserDto } from "../dto";
import * as bcrypt from 'bcrypt';
import { captureNotFoundException } from "../../../common/exceptions/modular.exception";
import { roles } from "../../roles/enum/roles.enum";

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
        const salt: any = await bcrypt.genSalt();
        createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

        const { ...restOfDto } = createUserDto;
        let user: User = this.repository.create({
            ...restOfDto,
        });

        user = await this.repository.save(user);
        // Mapea el objeto User a UserDto
        const userDto: UserDto = mapToDto(user, UserDto);
        return userDto;
    }

    getUsers(): Promise<User[]> {
        return this.findAll();
    }

    // FIXME HTTP ERROR 500, no existen en el usuario, los roles ni rol.
    async findUserById(id: string): Promise<UserDto> {
        let user: User = await this.repository.findOne({
            where: { id: id, deleted_at: null },
        });
        //let user = await this.findOneById(id)

        captureNotFoundException(user, 'User');
        // Mapea el objeto User a UserDto
        //const userDto: UserDto = mapToDto(user, UserDto);

        return user;
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

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {

        const { ...restOfDto } = updateUserDto;

        let updatedUser: Partial<User> = await this.update(id, restOfDto as unknown as Partial<User>);
        // Mapea el objeto User a UserDto
        return mapToDto(updatedUser, UserDto);

    }

    deleteUser(id: string): Promise<{ affected?: number }> {
        return this.delete(id);
    }

    findOneByEmailWithPassword(email: string): Promise<User> {
        return this.repository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password'],
        });

    }

    public async getAdminsEmails(): Promise<User[]> {
        return await this.repository.find({
            select: {
                email: true,
            },
            where: {
                rol: roles.Admin,
            }
        });
    }
}
