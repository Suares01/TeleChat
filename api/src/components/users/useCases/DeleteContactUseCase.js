import { Container } from 'typedi';

import { NotFoundError } from '../../../shared/errors';

export class DeleteContactUseCase {
  #contactsRepository;

  constructor(contactsRepository = Container.get('ContactsRepository')) {
    this.#contactsRepository = contactsRepository;
  }

  async execute({ userId, contactNumber }) {
    const contact = await this.#contactsRepository.findFirst(
      contactNumber,
      userId,
    );

    if (!contact) throw new NotFoundError('contact not found');

    await this.#contactsRepository.delete(contact.id);

    return true;
  }
}
