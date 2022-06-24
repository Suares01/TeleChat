import { Container } from 'typedi';

import { UnauthorizedError } from '../../../shared/errors';
import { createUser } from '../validations';

export class SignUpUseCase {
  #usersRepository;
  #hashService;

  constructor(
    usersRepository = Container.get('UsersRepository'),
    hashService = Container.get('HashService'),
  ) {
    this.#usersRepository = usersRepository;
    this.#hashService = hashService;
  }

  async execute({ email, password, phoneNumber }) {
    const validSchema = createUser({ email, password, phoneNumber });

    if (validSchema.error)
      throw new UnauthorizedError(validSchema.error.message);

    const emailAlreadyExists = await this.#usersRepository.findOne({
      email,
    });

    if (emailAlreadyExists)
      throw new UnauthorizedError(`user with email "${email}" already exists`);

    const phoneNumberAlreadyExists = await this.#usersRepository.findOne({
      phoneNumber,
    });

    if (phoneNumberAlreadyExists)
      throw new UnauthorizedError(
        `user with phone number "${phoneNumber}" already exists`,
      );

    const hashedPassword = await this.#hashService.hash(password);
    const user = await this.#usersRepository.create({
      phoneNumber,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
