import {Body, Controller, Get, HttpStatus, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateMemberDto} from "../../domain/member.domain";
import {MembersApplication} from "../../aplication/member.application";

@ApiTags('members management')
@Controller('members')
export class MembersController {
    constructor(private readonly membersApplication: MembersApplication) {}

    @Post()
    @ApiOperation({ summary: 'Create a new member.' })
    @ApiBody({ type: CreateMemberDto })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Member created', type: CreateMemberDto })
    async create(@Body() createMemberDto: CreateMemberDto) {
        try {
            const createdMember = await this.membersApplication.createMember(createMemberDto);
            return {
                statusCode: HttpStatus.CREATED,
                data: createdMember,
                message: 'Success: Member created',
            };
        } catch (err) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: Unable to create member',
                error: err.message,
            };
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Get all members and the number of books being borrowed by each member.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all members', isArray: true })
    async findAll() {
        try {
            const members = await this.membersApplication.getAllMembers();
            return {
                statusCode: HttpStatus.OK,
                data: members,
                message: 'Success: Retrieved all members',
            };
        } catch (err) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error: Unable to retrieve members',
                error: err.message,
            };
        }
    }
}
