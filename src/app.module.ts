import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
      BooksModule,
      MembersModule,
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async () => ({
          uri: process.env.MONGODB_URI,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
      }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
