import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UnprocessableEntityException,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v7 } from 'uuid';
import { ItemService } from './item.service';
import { Request } from 'express';
import { NewItemDto } from './dto/new-item.dto';
import { UserPayload } from '../../utils/Payload';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('item')
export class ItemController {
    constructor(
        private itemService: ItemService,
        private readonly configService: ConfigService,
    ) {}

    @UseGuards(JwtGuard)
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            fileFilter: (req, file, cb) => {
                const ext = file.originalname.split('.');
                const fileTypes = ['jpg', 'png', 'jpeg'];
                if (!fileTypes.includes(ext[ext.length - 1])) {
                    return cb(
                        new UnprocessableEntityException(
                            'Only jpeg files allowed.',
                        ),
                        false,
                    );
                }
                cb(null, true);
            },
            storage: diskStorage({
                destination: './' + process.env.UPLOADS,
                filename: (req, file, cb) => {
                    const fileExt = file.originalname.split('.');
                    const fileName = `${v7()}.${fileExt[fileExt.length - 1]}`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    @Post()
    async newItem(
        @Body(new ValidationPipe()) itemDto: NewItemDto,
        @UploadedFiles()
        files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        const port = this.configService.get<number>('PORT');
        const imagesList: string[] = files.map((v): string => {
            return (v.filename = `${req.protocol}://${req.hostname}${port != 443 ? ':' + port : ''}/images/${v.filename}`);
        });
        const user: UserPayload = req['user'];

        return await this.itemService.newItem(itemDto, imagesList, user.id);
    }

    @Get()
    async getItems() {
        return await this.itemService.getItems();
    }
}
