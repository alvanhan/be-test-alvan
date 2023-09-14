import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class requestBorrowingDto {
    @ApiProperty({
        description: 'The Code of the member',
        example: 'M001',
    })
    @IsString()
    @IsNotEmpty()
    memberCode: string;

    @ApiProperty({
        description: 'The Code of the book',
        example: 'BK-001',
    })
    @IsString()
    @IsNotEmpty()
    bookCode: string;

    _id: string;
    borrowDate: Date;
    returnDate: Date;
    memberId: string;
    bookId: string;
}
