import { Module } from '@nestjs/common';
import { BooksService } from './service/books/books.service';
import { BooksController } from './controller/books/books.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Book, BookSchema} from "./domain/book.entity";
import {Member, MemberSchema} from "../members/domain/member.entity";
import {Borrowing, BorrowingSchema} from "./domain/borrow.entity";
import {MembersService} from "../members/service/members/members.service";
import {BooksApplication} from "./aplication/book.application";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Borrowing.name, schema: BorrowingSchema },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService, MembersService,BooksApplication],
})
export class BooksModule {}
