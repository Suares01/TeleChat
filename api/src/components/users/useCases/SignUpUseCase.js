import { UnauthorizedError } from '../../../shared/errors';
import { createUser } from '../validations';

export class SignUpUseCase {
  #usersRepository;
  #hashService;

  constructor(usersRepository, hashService) {
    this.#usersRepository = usersRepository;
    this.#hashService = hashService;
  }

  async execute({ name, username, email, password }) {
    const validSchema = createUser({ name, username, password, email });

    if (validSchema.error)
      throw new UnauthorizedError(validSchema.error.message);

    const emailAlreadyExists = await this.#usersRepository.findOne({
      email,
    });

    if (emailAlreadyExists)
      throw new UnauthorizedError(`user with email "${email}" already exists`);

    const usernameAlreadyExists = await this.#usersRepository.findOne({
      username,
    });

    if (usernameAlreadyExists)
      throw new UnauthorizedError(
        `user with username "${username}" already exists`,
      );

    const hashedPassword = await this.#hashService.hash(password);
    const user = await this.#usersRepository.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
