import { UnauthorizedError } from '../../../../shared/errors';
import { SignUpUseCase } from '../SignUpUseCase';

describe('SignUpUseCase', () => {
  const mockedUsersRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
  };
  const mockedHashService = {
    hash: jest.fn(),
  };

  let signUpUseCase;
  beforeEach(() => {
    signUpUseCase = new SignUpUseCase(mockedUsersRepository, mockedHashService);
  });

  const defaultUser = {
    id: 'ds1f65ds1fd3s51fds65',
    phoneNumber: '+9999999999999',
    email: 'doe.10@mail.com',
    password: '123John8',
    created_at: new Date(),
  };

  it('if the user does not yet exist and all the data provided is correct, should create the user in the database with a encrypted password and return the created user.', async () => {
    mockedUsersRepository.create.mockResolvedValue(defaultUser);

    const { email, password, phoneNumber } = defaultUser;
    const user = await signUpUseCase.execute({ email, password, phoneNumber });

    expect(user).toEqual({
      ...defaultUser,
      ...{
        password: expect.any(String),
      },
    });
  });

  it('if the user with provided email already exists, should throw UnauthorizedError with message: user with email "provided_email@mail.com" already exists', async () => {
    mockedUsersRepository.findOne.mockResolvedValue(defaultUser);

    const { email, password, phoneNumber } = defaultUser;
    const user = signUpUseCase.execute({ email, password, phoneNumber });

    await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(user).rejects.toThrow(
      new UnauthorizedError(
        `user with email "${defaultUser.email}" already exists`,
      ),
    );
  });

  it('if the user with provided phoneNumber already exists, should throw UnauthorizedError with message: user with phone number "providedPhoneNumber" already exists', async () => {
    mockedUsersRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(defaultUser);

    const { email, password, phoneNumber } = defaultUser;
    const user = signUpUseCase.execute({ email, password, phoneNumber });

    await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(user).rejects.toThrow(
      new UnauthorizedError(
        `user with phone number "${defaultUser.phoneNumber}" already exists`,
      ),
    );
  });

  describe('Validation create user schema', () => {
    it('If a create user schema field has an incorrect type, should throw UnauthorizedError with message: "field" must be a type', async () => {
      const incorrectUserSchema = {
        ...defaultUser,
        ...{
          phoneNumber: 12345678,
        },
      };

      const user = signUpUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError('"phoneNumber" must be a string'),
      );
    });

    it('If the email format is invalid, should throw UnauthorizedError with message: "email" must be a valid email', async () => {
      const incorrectUserSchema = {
        ...defaultUser,
        ...{
          email: 'sdsj',
        },
      };

      const user = signUpUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError('"email" must be a valid email'),
      );
    });

    it('If the password is less than 8 characters, should throw UnauthorizedError with message: password must be at least 8 characters', async () => {
      const incorrectUserSchema = {
        ...defaultUser,
        ...{
          password: '1Lu',
        },
      };

      const user = signUpUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError('password must be at least 8 characters'),
      );
    });

    it('If the password does not contain at least 1 lowercase letter, should throw UnauthorizedError with message: password must contain at least one lowercase letter', async () => {
      const incorrectUserSchema = {
        ...defaultUser,
        ...{
          password: '132JOHN10',
        },
      };

      const user = signUpUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError(
          'password must contain at least one lowercase letter',
        ),
      );
    });

    it('If the password does not contain at least 1 uppercase letter, should throw UnauthorizedError with message: password must contain at least one uppercase letter', async () => {
      const incorrectUserSchema = {
        ...defaultUser,
        ...{
          password: '132john10',
        },
      };

      const user = signUpUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError(
          'password must contain at least one uppercase letter',
        ),
      );
    });

    it('if the password does not contain at least one number, password must contain at least one number', async () => {
      const incorrectUserSchema = {
        ...defaultUser,
        ...{
          password: 'JohnDoeProgrammer',
        },
      };

      const user = signUpUseCase.execute(incorrectUserSchema);

      await expect(user).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(user).rejects.toThrow(
        new UnauthorizedError('password must contain at least one number'),
      );
    });
  });
});
