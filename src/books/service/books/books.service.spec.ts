import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/mongoose'; // Import getModelToken

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'), // Gunakan getModelToken untuk BookModel
          useValue: {}, // Anda dapat menggunakan objek kosong untuk mock BookModel
        },
        {
          provide: getModelToken('Member'), // Gunakan getModelToken untuk MemberModel
          useValue: {}, // Anda dapat menggunakan objek kosong untuk mock MemberModel
        },
        {
          provide: getModelToken('Borrowing'), // Gunakan getModelToken untuk BorrowingModel
          useValue: {}, // Anda dapat menggunakan objek kosong untuk mock BorrowingModel
        },
        // Juga tambahkan penyedia untuk model lain jika diperlukan
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
