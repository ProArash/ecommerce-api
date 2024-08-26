import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cart } from '@prisma/client';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService) {}

    async getCartByUserId(userId: number): Promise<Cart> {
        return await this.prismaService.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: true,
                user: true,
            },
        });
    }

    async updateCart(cartDto: UpdateCartDto, userId: number): Promise<Cart> {
        const item = await this.prismaService.item.findUnique({
            where: {
                id: cartDto.itemId,
            },
        });
        const cart = await this.prismaService.cart.findUnique({
            where: {
                userId,
            },
        });
        return await this.prismaService.cart.update({
            where: {
                userId,
            },
            data: {
                total: cart.total + item.price,
                items: {
                    connect: item,
                },
            },
            include: {
                items: true,
                user: true,
            },
        });
    }
}
