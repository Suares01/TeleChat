import { NotFoundError } from '../../../../shared/errors';
import { GetUserUseCase } from '../GetUserUseCase';

describe('GetUserUseCase', () => {
  const mockedUsersRepository = {
    findOne: jest.fn(),
  };

  let getUserUseCase;
  beforeEach(() => {
    getUserUseCase = new GetUserUseCase(mockedUsersRepository);
  });

  it('If the user has registered in the database, should return his data', async () => {
    const user = {
      id: 'uuid',
      phoneNumber: '+9999999999999',
      email: 'doe.10@mail.com',
      password: '123John8',
      created_at: new Date(),
      contacts: [
        {
          id: 'uuid',
          phoneNumber: '+8888888888888',
          email: 'doe.12@mail.com',
          password: '123Doe235',
          created_at: new Date(),
        },
      ],
    };
    mockedUsersRepository.findOne.mockResolvedValue(user);

    const userData = await getUserUseCase.execute(user.id);

    expect(userData).toEqual(user);
  });

  it('if the user has not registered in the database, should throw a NotFoundError with message: user not found', async () => {
    mockedUsersRepository.findOne.mockResolvedValue(null);

    const userData = getUserUseCase.execute('uuid');

    await expect(userData).rejects.toBeInstanceOf(NotFoundError);
    await expect(userData).rejects.toThrow(new NotFoundError('user not found'));
  });
});
