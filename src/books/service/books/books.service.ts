import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Book} from "../../domain/book.entity";
import {Member} from "../../../members/domain/member.entity";
import {ReturnBookDto} from "../../domain/return.book.domain";
import {CreateBookDto} from "../../domain/book.domain";
import {Borrowing} from "../../domain/borrow.entity";
import {createBorrowingDto} from "../../domain/borrow.domain";

@Injectable()
export class BooksService {
    constructor(
        @InjectModel('Book') private readonly bookModel: Model<Book>,
        @InjectModel('Borrowing') private readonly borrowingModel: Model<Borrowing>,
        @InjectModel('Member') private readonly memberModel: Model<Member>,
    ) {}


    async isCodeUnique(code: string): Promise<boolean> {
        const existingBook = await this.bookModel.findOne({ code }).exec();
        return !existingBook;
    }

    async create(createBookDto: CreateBookDto) {
        const isUnique = await this.isCodeUnique(createBookDto.code);

        if (!isUnique) {
            throw new BadRequestException(
                'Books code already exists!. input new code for the book!',
            );
        }

        const createdBook = new this.bookModel(createBookDto);
        return createdBook.save();
    }

    async findAll(): Promise<Book[]> {
        const allBooks = await this.bookModel.find().exec();
        const activeBorrowings = await this.borrowingModel
            .find({ returnDate: null })
            .exec();
        const borrowedBookIds = activeBorrowings.map((borrowing) =>
            borrowing.bookId.toString(),
        );

        const availableBooks = allBooks.filter((book) => {
            const bookId = book._id.toString();
            const isBorrowed = borrowedBookIds.includes(bookId);
            return book.stock > 0 || !isBorrowed;
        });

        return availableBooks;
    }

    async getMember(memberCode: string): Promise<Member> {
        const member = await this.memberModel.findOne({ code: memberCode });
        return member;
    }

    async findBookByCode(bookCode: string): Promise<Book | null> {
        const book = await this.bookModel.findOne({ code: bookCode });
        return book;
    }

    async borrowBook(requestBorrowingDto: createBorrowingDto) {
        const book = await this.findBookByCode(requestBorrowingDto.bookCode);
        const member = await this.getMember(requestBorrowingDto.memberCode);

        if (!book || !member) {
            throw new NotFoundException('Books or members not found!');
        }

        if (book.stock <= 0) {
            throw new BadRequestException('Books are out of stock!');
        }

        if (member.PenaltyUntil && new Date() < member.PenaltyUntil) {
            throw new BadRequestException('Member is under penalty!');
        }

        const borrowedBooks = await this.borrowingModel.find({
            memberId: member._id,
            returnDate: null,
        });

        if (borrowedBooks.length >= 2) {
            throw new BadRequestException('You have borrowed 2 or more books');
        }

        const existingBorrowing = await this.borrowingModel.findOne({
            bookId: book._id,
            returnDate: null,
        });

        if (existingBorrowing && book.stock <= 0) {
            throw new BadRequestException(
                'Books have been borrowed by other members',
            );
        }

        const borrowing = new this.borrowingModel();
        borrowing.borrowDate = new Date();
        borrowing.memberId = member._id;
        borrowing.bookId = book._id;

        book.stock--;
        await book.save();

        const createdBorrowing = await borrowing.save();
        return createdBorrowing;
    }

    async returnBook(returnBookDto: ReturnBookDto) {
        const book = await this.findBookByCode(returnBookDto.bookCode);
        const member = await this.getMember(returnBookDto.memberCode);

        if (!book || !member) {
            throw new NotFoundException('Books or members not found!');
        }

        const borrowing = await this.borrowingModel
            .findOne({
                memberId: member._id,
                bookId: book._id,
                returnDate: null,
            })
            .exec();

        if (!borrowing) {
            throw new NotFoundException('Borrowing record not found');
        }

        try {
            const borrowDate = borrowing.borrowDate;
            const actualReturnDate = new Date();
            const daysLate = Math.ceil(
                (actualReturnDate.getTime() - borrowDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            borrowing.returnDate = actualReturnDate;

            if (daysLate > 7) {
                member.PenaltyUntil = new Date(actualReturnDate);
                member.PenaltyUntil.setDate(member.PenaltyUntil.getDate() + 3);
            }

            book.stock += 1;
            await borrowing.save();
            await member.save();
            await book.save();

            return borrowing;
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Error processing book return', error);
        }
    }
}
