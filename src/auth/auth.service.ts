import { Injectable, Logger, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    
    try {
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save( user );
      // Esto para no retornar el password al usuario
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id, email: user.email })
      };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true }
    });

    if( !user ) throw new UnauthorizedException('Credentials are not valid (email)');

    if ( !bcrypt.compareSync(password, user.password )){
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email })
    };
  }


  async checkAuthStatus(user: User){
    
    const { id, email, password, nombreCompleto } = user;
    
    return {
      id, 
      email, 
      password, 
      nombreCompleto,
      token: this.getJwtToken({ id, email })
    }
  }

  /**
 * Metodos Privados
 */

  private getJwtToken( payload: JwtPayload ){

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check servers logs',
    );
  }

}
