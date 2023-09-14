import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateBookDto {
    _id: string;

    @ApiProperty({
        description: 'The code of the book',
        example: 'BK-001',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: 'The title of the book',
        example: 'Sample Book Title',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The author of the book',
        example: 'Alvan Han',
    })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({
        description: 'The stock of the book',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    stock: number;
}
