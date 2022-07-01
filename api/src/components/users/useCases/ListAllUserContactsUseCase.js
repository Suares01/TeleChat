import { Container } from 'typedi';

export class ListAllUserContactsUseCase {
  #contactsRepository;

  constructor(contactsRepository = Container.get('ContactsRepository')) {
    this.#contactsRepository = contactsRepository;
  }

  async execute(userId) {
    const contacts = await this.#contactsRepository.findMany(userId);

    return contacts;
  }
}
