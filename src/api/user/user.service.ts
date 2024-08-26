import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return await this.prismaService.user.findMany();
    }

    async getUserItemsById(userId: number): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                items: true,
            },
        });
    }

    async getUserCartById(userId: number): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                cart: true,
            },
        });
    }

    async getUserInvoicesById(userId: number): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                invoices: true,
            },
        });
    }

    async getUserById(userId: number): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
    }
}
