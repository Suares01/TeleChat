import { prisma } from '../../../../database/prisma';

export class PrismaUsersRepository {
  #prisma;

  constructor() {
    this.#prisma = prisma;
  }

  async create({ name, username, email, password }) {
    const user = await this.#prisma.user.create({
      data: {
        email,
        name,
        password,
        username,
      },
    });

    return user;
  }

  async findOne({ id, email, username }) {
    const user = await this.#prisma.user.findUnique({
      where: {
        ...((id && { id }) ||
          (email && { email }) ||
          (username && { username })),
      },
    });

    return user;
  }
}
