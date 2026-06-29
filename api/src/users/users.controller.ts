import { Controller, Get, Put, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { UsersService } from './users.service'
import { UploadsService } from '../uploads/uploads.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'

@Controller('users')
export class UsersController {
  constructor(
    private users: UsersService,
    private uploads: UploadsService,
  ) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  stats(@CurrentUser() user: { id: string }) {
    return this.users.getStats(user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findPublic(id)
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: { id: string }, @Body() body: { name?: string; theme?: string }) {
    return this.users.updateProfile(user.id, body)
  }

  @Put('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async uploadAvatar(@CurrentUser() user: { id: string }, @UploadedFile() file: Express.Multer.File) {
    const { url } = await this.uploads.saveImage(file, 'perfis')
    return this.users.updateProfile(user.id, { avatarUrl: url })
  }

  @Put('me/password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  changePassword(@CurrentUser() user: { id: string }, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.users.changePassword(user.id, body.currentPassword, body.newPassword)
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  deleteAccount(@CurrentUser() user: { id: string }) {
    return this.users.deleteAccount(user.id)
  }
}
