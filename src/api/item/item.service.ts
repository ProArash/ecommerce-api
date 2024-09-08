import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { NewItemDto } from './dto/new-item.dto';
import { Item } from '@prisma/client';

@Injectable()
export class ItemService {
    constructor(private prismaService: PrismaService) {}

    async newItem(
        itemDto: NewItemDto,
        files: string[],
        userId: number,
    ): Promise<Item> {
        return await this.prismaService.item.create({
            data: {
                name: itemDto.name,
                caption: itemDto.caption,
                price: Number(itemDto.price),
                categoryId: Number(itemDto.categoryId),
                userId: Number(userId),
                brandId: Number(itemDto.brandId),
                images: {
                    createMany: {
                        data: files.map((url) => ({
                            url,
                        })),
                    },
                },
            },
        });
    }

    async getItems(): Promise<Item[]> {
        return await this.prismaService.item.findMany({
            include: {
                images: true,
                category: true,
                user: true,
            },
        });
    }
}
