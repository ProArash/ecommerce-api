import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Category } from '@prisma/client';
import { NewCategoryDto } from './dto/new-cat.dto';

@Injectable()
export class CategoryService {
    constructor(private prismaService: PrismaService) {}

    async getAll(): Promise<Category[]> {
        return this.prismaService.category.findMany({
            include: {
                items: true,
            },
        });
    }

    async newCategoty(
        catDto: NewCategoryDto,
        userId: number,
    ): Promise<Category> {
        const cat = await this.prismaService.category.findUnique({
            where: {
                title: catDto.title,
            },
        });
        if (cat) {
            throw new ConflictException('Category already exists.');
        }
        return await this.prismaService.category.create({
            data: {
                title: catDto.title,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
}
