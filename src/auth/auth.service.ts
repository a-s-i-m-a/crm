import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/users.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async registration(registerDto: RegisterDto) {
    const candidate = await this.usersService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(registerDto.password, 5);
    const user = await this.usersService.createUser({
      ...registerDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: UserEntity) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  public async validateUser(loginDto: LoginDto) {
    try {
      const user = await this.usersService.getUserByEmail(loginDto.email);
      const passwordEquals = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException({
          message: 'Некорректный емайл или пароль',
        });
      } else {
        throw new InternalServerErrorException('Некорректный емайл или пароль');
      }
    }
  }
}
