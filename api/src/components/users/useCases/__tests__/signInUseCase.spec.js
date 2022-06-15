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
    refreshToken: {
      sign: jest.fn(),
    },
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
    id: 'ds1f65ds1fd3s51fds65',
    name: 'John Doe',
    username: 'john',
    email: 'doe.10@mail.com',
    password: '123John8',
    created_at: new Date(),
  };

  it('If the user was registered and the provided password is correct, should return a JWT Token and a refresh token.', async () => {
    const sampleToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJlbWFpbCI6InRlc3RlQG1haWwuY29tIiwiaWF0IjoxNjU1MjU1ODE5LCJleHAiOjE2NTUyNTU4NzksImF1ZCI6IlRlbGVDaGF0LkFQSSIsImlzcyI6ImFwaV91cmwiLCJzdWIiOiIwN2VkY2RiYi05ZWIxLTQyNjYtYjdmNS01NWQ1ZTk1ZTE2NDkifQ.b7gz29FSL0S5a80YblDpbw7GW1snF9QOhFZ44umFMfQ';
    const sampleRefreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6InJ0K2p3dCJ9.eyJpYXQiOjE2NTUyNTU3MzIsImV4cCI6MTY1NTI1NTkxMiwiYXVkIjoiVGVsZUNoYXQuQVBJIiwiaXNzIjoiYXBpX3VybCIsInN1YiI6IjA3ZWRjZGJiLTllYjEtNDI2Ni1iN2Y1LTU1ZDVlOTVlMTY0OSJ9.-LPvJkP7Shegm3IXzeO-nChGTx-lRQMG7TTilcIIRV8';

    mockedUsersRepository.findOne.mockResolvedValue(defaultUser);
    mockedHashService.compare.mockResolvedValue(true);
    mockedTokenService.sign.mockReturnValue(sampleToken);
    mockedTokenService.refreshToken.sign.mockResolvedValue(sampleRefreshToken);

    const { email, password } = defaultUser;
    const auth = await signInUseCase.execute({
      email,
      password,
    });

    expect(mockedTokenService.sign).toHaveBeenCalled();
    expect(mockedTokenService.refreshToken.sign).toHaveBeenCalled();
    expect(auth).toEqual({
      accessToken: sampleToken,
      refreshToken: sampleRefreshToken,
    });
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
