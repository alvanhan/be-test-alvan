import {Body, Controller, Get, HttpStatus, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateBookDto} from "../../domain/book.domain";
import {ReturnBookDto} from "../../domain/return.book.domain";
import {createBorrowingDto} from "../../domain/borrow.domain";
import {BooksApplication} from "../../aplication/book.application";

@ApiTags('books management')
@Controller('books')
export class BooksController {
    constructor(private readonly booksApplication: BooksApplication) {}

    @Get()
    @ApiOperation({ summary: 'Get all books and quantities.' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all books', isArray: true })
    async getall() {
        try {
            const books = await this.booksApplication.getAllBook();
            return {
                statusCode: HttpStatus.OK,
                data: books,
                message: 'Success: Retrieved all books',
            };
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error: Unable to retrieve books',
                error: err.message,
            };
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new book.' })
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Successfully created a new book' })
    async create(@Body() createBookDto: CreateBookDto) {
        try {
            const createdBook = await this.booksApplication.createBook(createBookDto);
            return {
                statusCode: HttpStatus.CREATED,
                data: createdBook,
                message: 'Success: Book created',
            };
        } catch (err) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Unable to create book',
                error: err.message,
            };
        }
    }

    @Post('borrow')
    @ApiOperation({ summary: 'Borrow a book, for borrow the books.' })
    @ApiBody({ type: createBorrowingDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully borrowed the book', type: createBorrowingDto })
    async borrowBook(@Body() requestBorrowingDto: createBorrowingDto) {
        try {
            const borrowingResult = await this.booksApplication.borrowBook(requestBorrowingDto);
            return {
                statusCode: HttpStatus.OK,
                data: borrowingResult,
                message: 'Success: Book borrowed',
            };
        } catch (err) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Unable to borrow book',
                error: err.message,
            };
        }
    }

    @Post('return')
    @ApiOperation({ summary: 'Return a book, for return the books.' })
    @ApiBody({ type: ReturnBookDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully returned the book', type: ReturnBookDto })
    async returnBook(@Body() returnBookDto: ReturnBookDto) {
        try {
            const returnResult = await this.booksApplication.returnBook(returnBookDto);
            return {
                statusCode: HttpStatus.OK,
                data: returnResult,
                message: 'Success: Book returned',
            };
        } catch (err) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Unable to return book',
                error: err.message,
            };
        }
    }
}


