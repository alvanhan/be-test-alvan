import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Book extends Document {
    @Prop()
    code: string;

    @Prop()
    title: string;

    @Prop()
    author: string;

    @Prop()
    stock: number;
}
export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.__v;
    },
});
