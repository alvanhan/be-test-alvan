import {Injectable} from "@nestjs/common";
import {MembersService} from "../service/members/members.service";
import {CreateMemberDto} from "../domain/member.domain";


@Injectable()
export class MembersApplication {
    constructor(private readonly membersService: MembersService) {}

    async createMember(createMemberDto: CreateMemberDto) {
        return this.membersService.create(createMemberDto);
    }

    async getAllMembers() {
        return this.membersService.findAll();
    }
}