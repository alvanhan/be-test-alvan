import { Module } from '@nestjs/common';

import { MembersService } from './service/members/members.service';
import {MembersController} from "./controller/members/members.controller";
import {BooksService} from "../books/service/books/books.service";
import {BooksApplication} from "../books/aplication/book.application";
import {MongooseModule} from "@nestjs/mongoose";
import {Book, BookSchema} from "../books/domain/book.entity";
import {Member, MemberSchema} from "./domain/member.entity";
import {Borrowing, BorrowingSchema} from "../books/domain/borrow.entity";
import {MembersApplication} from "./aplication/member.application";

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Borrowing.name, schema: BorrowingSchema },
    ]),
  ],
  controllers: [MembersController],
  providers: [BooksService, MembersService,BooksApplication,MembersApplication]
})
export class MembersModule {}
