import {Body,Controller,Get,Post,Req,UploadedFile,UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { Public } from './public.decorator';
import { ApiTags, ApiOperation,ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('authorise')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Regisztráció (opcionális profilképpel)' })
  @ApiConsumes('multipart/form-data')
  @Public()
  @Post('register')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profilePictures',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async register(
    @Body() dto: RegisterUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.profile_image = `/uploads/profilePictures/${file.filename}`;
    }
    return this.authService.authRegister(dto);
  }

  @ApiOperation({ summary: 'Bejelentkezés, visszaad egy JWT tokent' })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.authLogin(dto);
  }

  @ApiOperation({ summary: 'Bejelentkezett felhasználó adatai' })
  @ApiBearerAuth()
  @Get('me')
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }
}
