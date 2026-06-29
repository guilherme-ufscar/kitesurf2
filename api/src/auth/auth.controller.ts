import { Controller, Post, Get, Body, Query, UseGuards, HttpCode } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { Throttle } from '@nestjs/throttler'

class RegisterDto {
  @IsString() name: string
  @IsEmail() email: string
  @IsString() @MinLength(8) password: string
  @IsString() turnstileToken?: string
}

class LoginDto {
  @IsEmail() email: string
  @IsString() password: string
  @IsString() turnstileToken?: string
}

class RefreshDto { @IsString() refreshToken: string }
class ForgotDto  { @IsEmail() email: string }
class ResetDto   { @IsString() token: string; @IsString() @MinLength(8) password: string }

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  register(@Body() body: RegisterDto) { return this.auth.register(body) }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  login(@Body() body: LoginDto) { return this.auth.login(body) }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() body: RefreshDto) { return this.auth.refresh(body.refreshToken) }

  @Post('forgot-password')
  @HttpCode(200)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  forgotPassword(@Body() body: ForgotDto) { return this.auth.forgotPassword(body.email) }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() body: ResetDto) { return this.auth.resetPassword(body.token, body.password) }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) { return this.auth.verifyEmail(token) }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { id: string }) { return this.auth.me(user.id) }
}
