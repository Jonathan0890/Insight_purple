import { Controller, Post, Body } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authsService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authsService.login(dto);
  }
}