import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Member extends Document {
    @Prop({ unique: true })
    code: string;

    @Prop()
    name: string;

    @Prop({ type: Date })
    PenaltyUntil: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
});
