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

  async findFirst(phoneNumber, userId) {
    const contact = await this.#model.findFirst({
      where: {
        phoneNumber,
        userId,
      },
    });

    return contact;
  }

  async findMany(userId) {
    const contacts = await this.#model.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return contacts;
  }

  async delete(id) {
    const deletedContact = await this.#model.delete({
      where: {
        id,
      },
    });

    return deletedContact;
  }

  async update(id, newName) {
    const updatedContact = await this.#model.update({
      where: {
        id,
      },
      data: {
        name: newName,
      },
    });

    return updatedContact;
  }
}
