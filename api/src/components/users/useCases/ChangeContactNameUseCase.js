import { Container } from 'typedi';

import { NotFoundError } from '../../../shared/errors';

export class ChangeContactNameUseCase {
  #contactsRepository;

  constructor(contactsRepository = Container.get('ContactsRepository')) {
    this.#contactsRepository = contactsRepository;
  }

  async execute({ userId, contactNumber, newName }) {
    const contact = await this.#contactsRepository.findFirst(
      contactNumber,
      userId,
    );

    if (!contact) throw new NotFoundError('contact not found');

    const updatedContact = await this.#contactsRepository.update(
      contact.id,
      newName,
    );

    return updatedContact;
  }
}
