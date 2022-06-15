import { Container } from 'typedi';

import { UnauthorizedError } from '../../../shared/errors';
import { authUser } from '../validations';

export class SignInUseCase {
  #usersRepository;
  #hashService;
  #tokenService;

  constructor(
    usersRepository = Container.get('UsersRepository'),
    hashService = Container.get('HashService'),
    tokenService = Container.get('TokenService'),
  ) {
    this.#usersRepository = usersRepository;
    this.#hashService = hashService;
    this.#tokenService = tokenService;
  }

  async execute({ email, password }) {
    const validSchema = authUser({ email, password });

    if (validSchema.error)
      throw new UnauthorizedError(validSchema.error.message);

    const user = await this.#usersRepository.findOne({ email });

    if (!user) throw new UnauthorizedError('email or password incorrect');

    const verifyPassword = await this.#hashService.compare(
      password,
      user.password,
    );

    if (!verifyPassword)
      throw new UnauthorizedError('email or password incorrect');

    const { id } = user;
    const accessToken = this.#tokenService.sign({ email, userId: id });
    const refreshToken = await this.#tokenService.refreshToken.sign(id);

    return { accessToken, refreshToken };
  }
}
