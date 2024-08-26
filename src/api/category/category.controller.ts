import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { NewCategoryDto } from './dto/new-cat.dto';
import { CategoryService } from './category.service';
import { UserPayload } from '../../utils/Payload';
import { Request } from 'express';

@Controller('category')
export class CategoryController {
    constructor(private catService: CategoryService) {}

    @UseGuards(JwtGuard)
    @Post()
    async newCategory(
        @Body(new ValidationPipe()) catDto: NewCategoryDto,
        @Req() req: Request,
    ) {
        const user: UserPayload = req['user'];
        return await this.catService.newCategoty(catDto, user.id);
    }

    @UseGuards(JwtGuard)
    @Get()
    async getCategories() {
        return await this.catService.getAll();
    }
}
