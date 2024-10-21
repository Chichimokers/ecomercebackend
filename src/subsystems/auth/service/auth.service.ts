import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/subsystems/user/entities/user.entity';
import { UserService } from 'src/subsystems/user/service/user.service';
import { CreateUserDto, UserDto } from 'src/subsystems/user/dto';
import { UserController } from '../../user/controller/user.controller';
import { roles } from 'src/subsystems/roles/enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(UserService) private userService: UserService,
    
    private jwt: JwtService,
  ) {}

  async signup(userdto:CreateUserDto): Promise<User> {
    
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(userdto.password, salt);

    userdto.password = hash;

    return await this.userService.create({
      
      rol:roles.User ,
      email :userdto.email,
      name: userdto.name,
      password: userdto.password,

    })

  }

  async validateUser(username: string, password: string): Promise<User> {

    const foundUser = await this.userRepository.findOne({
      where: { name:username },
    });
  

    if (foundUser) {

      if (await bcrypt.compare(password, foundUser.password)) {
        
       console.log(foundUser)
       return foundUser;
      }

      return null;
    }
    return null;
  }

  async login(user: User) {
 
    const payload = { username: user.name, sub: user.id, role: user.rol };

    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
