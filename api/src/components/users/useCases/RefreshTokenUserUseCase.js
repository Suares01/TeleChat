import { Container } from 'typedi';

import { UnauthorizedError } from '../../../shared/errors';

export class RefreshTokenUserUseCase {
  #tokenService;
  #usersRepository;

  constructor(
    tokenService = Container.get('TokenService'),
    usersRepository = Container.get('UsersRepository'),
  ) {
    this.#tokenService = tokenService;
    this.#usersRepository = usersRepository;
  }

  async execute(refreshToken) {
    const user = await this.#getUser(refreshToken);

    if (!user) throw new UnauthorizedError('refresh token is invalid');

    const { email, id } = user;
    const accessToken = this.#tokenService.sign({ email, userId: id });

    return accessToken;
  }

  async #getUser(refreshToken) {
    try {
      const { payload } = await this.#tokenService.refreshToken.verify(
        refreshToken,
      );

      const userId = payload.sub;
      const user = await this.#usersRepository.findOne({ id: userId });

      return user || null;
    } catch (error) {
      if (error) throw new UnauthorizedError('refresh token is invalid');
    }
  }
}
