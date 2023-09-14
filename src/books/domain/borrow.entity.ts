import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {Member} from "../../members/domain/member.entity";
import {Book} from "./book.entity";

@Schema()
export class Borrowing extends Document {
    @Prop({ type: Date, default: Date.now })
    borrowDate: Date;

    @Prop({ type: Date })
    returnDate: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
    memberId: Member;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
    bookId: Book;
}

export const BorrowingSchema = SchemaFactory.createForClass(Borrowing);

BorrowingSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.__v;
    },
});
