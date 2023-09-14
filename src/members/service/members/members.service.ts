import { Injectable } from '@nestjs/common';
import {CreateMemberDto} from "../../domain/member.domain";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Book} from "../../../books/domain/book.entity";
import {Borrowing} from "../../../books/domain/borrow.entity";
import {Member} from "../../domain/member.entity";

@Injectable()
export class MembersService {
    constructor(
        @InjectModel('Book') private readonly bookModel: Model<Book>,
        @InjectModel('Borrowing') private readonly borrowingModel: Model<Borrowing>,
        @InjectModel('Member') private readonly memberModel: Model<Member>,
    ) {}

    async findMemberByNameOrCode(name: string, code: string) {
        return this.memberModel.findOne({ $or: [{ name }, { code }] }).exec();
    }
    async getLastMemberCode(): Promise<string> {
        const lastMember = await this.memberModel
            .findOne({}, {}, { sort: { code: -1 } })
            .exec();

        if (lastMember) {
            const lastCode = lastMember.code.substr(3);
            const nextCode = parseInt(lastCode, 10) + 1;
            return `M00${nextCode}`;
        } else {
            return 'M001';
        }
    }

    async create(createMemberDto: CreateMemberDto) {

        const existingMember = await this.findMemberByNameOrCode(
            createMemberDto.name,
            createMemberDto.code
        );

        if (existingMember) {
            throw new Error('Member with the same name or code already exists');
        }

        const generatedCode = await this.getLastMemberCode();
        createMemberDto.code = generatedCode;

        const createdMember = new this.memberModel(createMemberDto);
        return createdMember.save();
    }

    async findAll(): Promise<any[]> {
        const allMembers = await this.memberModel.find().exec();
        const activeBorrowings = await this.borrowingModel
            .find({ returnDate: null })
            .exec();
        const ByMember: { [key: string]: number } = {};

        activeBorrowings.forEach((borrowing) => {
            if (borrowing.memberId) {
                const memberId = borrowing.memberId.toString();
                ByMember[memberId] = (ByMember[memberId] || 0) + 1;
            }
        });

        const membersWithBooksCount = allMembers.map((member) => {
            const memberId = member._id.toString();
            const booksBorrowed = ByMember[memberId] || 0;
            return { ...member.toObject(), booksBorrowed };
        });

        return membersWithBooksCount;
    }
}
