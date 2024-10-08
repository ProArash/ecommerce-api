import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NewCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;
}
