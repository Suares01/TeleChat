import { Container } from 'typedi';

import { NotFoundError } from '../../../shared/errors';

export class AddContactUseCase {
  #contactsRepository;
  #usersRepository;

  constructor(
    contactsRepository = Container.get('ContactsRepository'),
    usersRepository = Container.get('UsersRepository'),
  ) {
    this.#contactsRepository = contactsRepository;
    this.#usersRepository = usersRepository;
  }

  async execute(userId, { contactName, contactPhoneNumber }) {
    const contactExists = await this.#usersRepository.findOne({
      phoneNumber: contactPhoneNumber,
    });

    if (!contactExists)
      throw new NotFoundError(
        `user with phone number "${contactPhoneNumber}" not found`,
      );

    const request = await this.#contactsRepository.create({
      name: contactName,
      phoneNumber: contactPhoneNumber,
      userId,
    });

    return request;
  }
}
