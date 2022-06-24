import { prisma } from '../../../../database/prisma';

export class PrismaContactsRepository {
  #model;

  constructor() {
    this.#model = prisma.contact;
  }

  async create({ name, phoneNumber, userId }) {
    const contact = await this.#model.create({
      data: {
        name,
        phoneNumber,
        userId,
      },
    });

    return contact;
  }
}
