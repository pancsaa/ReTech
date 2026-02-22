import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import {FileInterceptor} from "@nestjs/platform-express"
import { diskStorage } from 'multer';

function createValidName(imageName: string){
    return imageName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
}

@Controller('authorise')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @UseInterceptors(
        FileInterceptor('image',{
            storage: diskStorage({
                destination:'./profilePictures',
                filename: (req, file, cb)=>cb(null, createValidName(file.originalname))
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
        if(!file) throw new BadRequestException('Image file is missing.');
        return await this.authService.authRegister({
            ...user, profile_image: `/profilePictures/${file.filename}`
        });
    }

    @Post('login')
    async login(@Body() user:LoginUserDto){
        return await this.authService.authLogin(user)
    }
}
