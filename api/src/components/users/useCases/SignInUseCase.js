import { UnauthorizedError } from '../../../shared/errors';
import { authUser } from '../validations';

export class SignInUseCase {
  #usersRepository;
  #hashService;
  #tokenService;

  constructor(usersRepository, hashService, tokenService) {
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
    const token = this.#tokenService.sign({ user: { id } });

    return token;
  }
}
