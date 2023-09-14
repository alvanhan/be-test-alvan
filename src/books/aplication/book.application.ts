import {Injectable} from "@nestjs/common";
import {BooksService} from "../service/books/books.service";
import {CreateBookDto} from "../domain/book.domain";
import { ReturnBookDto } from "../domain/return.book.domain";
import {createBorrowingDto} from "../domain/borrow.domain";
@Injectable()
export class BooksApplication {
    constructor(private readonly booksService: BooksService) {}


    async getAllBook() {
        return this.booksService.findAll();
    }

    async createBook(createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    async borrowBook(requestBorrowingDto: createBorrowingDto) {
        return this.booksService.borrowBook(requestBorrowingDto);
    }

    async returnBook(returnBookDto: ReturnBookDto) {
        return this.booksService.returnBook(returnBookDto);
    }
}