import { prisma } from '../../../../database/prisma';

export class PrismaUsersRepository {
  #model;

  constructor() {
    this.#model = prisma.user;
  }

  async create({ phoneNumber, email, password }) {
    const user = await this.#model.create({
      data: {
        phoneNumber,
        email,
        password,
      },
      include: {
        contacts: true,
      },
    });

    return user;
  }

  async findOne({ id, email, phoneNumber }) {
    const user = await this.#model.findUnique({
      where: {
        ...((id && { id }) ||
          (email && { email }) ||
          (phoneNumber && { phoneNumber })),
      },
    });

    return user;
  }
}
