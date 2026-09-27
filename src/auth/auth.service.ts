import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(dto.password, foundUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      rol: foundUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}