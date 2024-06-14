import { Injectable } from '@nestjs/common';
import { User, PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaClient) {}

  async findUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser() {
    return this.prisma.user.create({
      data: {
        name: `Jefferson ${new Date().getTime().toString()}`,
        email: `${new Date().getTime().toString()}@gmail.com`,
      },
    });
  }
}
