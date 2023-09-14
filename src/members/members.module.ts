import { Module } from '@nestjs/common';

import { MembersService } from './service/members/members.service';
import {MembersController} from "./controller/members/members.controller";

@Module({
  controllers: [MembersController],
  providers: [MembersService]
})
export class MembersModule {}
