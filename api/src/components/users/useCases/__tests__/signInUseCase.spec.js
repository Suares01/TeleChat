import { UnauthorizedError } from '../../../../shared/errors';
import { SignInUseCase } from '../SignInUseCase';

describe('SignInUseCase', () => {
  const mockedUsersRepository = {
    findOne: jest.fn(),
  };
  const mockedHashService = {
    compare: jest.fn(),
  };
  const mockedTokenService = {
    sign: jest.fn(),
  };

  let signInUseCase;
  beforeEach(() => {
    signInUseCase = new SignInUseCase(
      mockedUsersRepository,
      mockedHashService,
      mockedTokenService,
    );
  });

  const defaultUser = {
    name: 'John Doe',
    username: 'john',
    email: 'doe.10@mail.com',
    password: '123John8',
  };

  it('If the user was registered and the provided password is correct, should return a JWT Token.', async () => {
    const sampleToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    mockedUsersRepository.findOne.mockResolvedValue(defaultUser);
    mockedHashService.compare.mockResolvedValue(true);
    mockedTokenService.sign.mockResolvedValue(sampleToken);

    const { email, password } = defaultUser;
    const token = await signInUseCase.execute({ email, password });

    expect(mockedTokenService.sign).toHaveBeenCalled();
    expect(token).toBe(sampleToken);
  });

  it("If the user wasn't registered, should throw UnauthorizedError with message: email or password incorrect", async () => {
    mockedUsersRepository.findOne.mockResolvedValue(null);

    const { email, password } = defaultUser;
    const token = signInUseCase.execute({ email, password });

    await expect(token).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(token).rejects.toThrow(
      new UnauthorizedError('email or password incorrect'),
    );
  });

  it('If the user was registered but the password is incorrect, should throw UnauthorizedError with message: email or password incorrect', async () => {
    mockedUsersRepository.findOne.mockResolvedValue(defaultUser);
    mockedHashService.compare.mockResolvedValue(false);

    const { email, password } = defaultUser;
    const token = signInUseCase.execute({ email, password });

    await expect(token).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(token).rejects.toThrow(
      new UnauthorizedError('email or password incorrect'),
    );
  });

  describe('Validation auth user schema', () => {
    it('If a auth user schema field has an incorrect type, should throw UnauthorizedError with message: "field" must be a type', async () => {
      const incorrectAuthSchema = {
        email: 'teste@mail.com',
        password: 12345678,
      };

      const user = signInUseCase.execute(incorrectAuthSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError('"password" must be a string'),
      );
    });

    it('If the email format is invalid, should throw UnauthorizedError with message: "email" must be a valid email', async () => {
      const incorrectUserSchema = {
        email: 'incorrect_email',
        password: '35John789',
      };

      const user = signInUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError('"email" must be a valid email'),
      );
    });
  });
});
