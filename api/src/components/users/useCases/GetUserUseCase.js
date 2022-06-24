import Container from 'typedi';

import { NotFoundError } from '../../../shared/errors';

export class GetUserUseCase {
  #usersRepository;

  constructor(usersRepository = Container.get('UsersRepository')) {
    this.#usersRepository = usersRepository;
  }

  async execute(userId) {
    const user = await this.#usersRepository.findOne({ id: userId });

    if (!user) throw new NotFoundError('user not found');

    return user;
  }
}
