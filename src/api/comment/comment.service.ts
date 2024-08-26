import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Comment, User } from '@prisma/client';
import { NewCommentDto } from './dto/new-comment.dto';

@Injectable()
export class CommentService {
    constructor(private prismaService: PrismaService) {}

    async getCommentsByItemId(itemId: number): Promise<Comment[]> {
        return await this.prismaService.comment.findMany({
            where: {
                itemId,
            },
            include: {
                user: true,
            },
        });
    }

    async newComment(cmDto: NewCommentDto): Promise<Comment> {
        return await this.prismaService.comment.create({
            data: {
                text: cmDto.text,
                userId: cmDto.userId,
                itemId: cmDto.itemId,
            },
            include: {
                user: true,
            },
        });
    }

    async getCommentByUserId(userId: number): Promise<User> {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                comments: true,
            },
        });
    }
}
