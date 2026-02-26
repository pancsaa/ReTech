import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import {FileInterceptor} from "@nestjs/platform-express"
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { Public } from './public.decorator';

function createValidName(imageName: string){
    return imageName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
}

@Controller('authorise')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
    @UseInterceptors(
        FileInterceptor('image',{
            storage: diskStorage({
                destination:'./uploads/profilePictures',
                filename: (req, file, cb)=>{
                    const safe=createValidName(file.originalname)
                    cb(null, `${randomUUID()}-${safe}`)
                }
            }),
            limits: {fileSize: 3*1024*1024},
            fileFilter: (req, file, cb)=>{
                if(!file.mimetype.startsWith('image/')){
                    return cb(new BadRequestException('Only image files are allowed.')as any, false)
                }
                cb(null, true)
            }
        }),
    )
    @Post('register')
    async register(@Body() user: RegisterUserDto, @UploadedFile() file?: Express.Multer.File){
        return await this.authService.authRegister({
            ...user, profile_image: file ? `/profilePictures/${file.filename}` : undefined
        });
    }

    @Public()
    @Post('login')
    async login(@Body() user:LoginUserDto){
        return await this.authService.authLogin(user)
    }
}
