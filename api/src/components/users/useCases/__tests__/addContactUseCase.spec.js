import { NotFoundError } from '../../../../shared/errors';
import { AddContactUseCase } from '../AddContactUseCase';

describe('AddContactUseCase', () => {
  const mockedContactsRepository = {
    create: jest.fn(),
  };
  const mockedUsersRepository = {
    findOne: jest.fn(),
  };

  const user = {
    id: 'ds1f65ds1fd3s51fds65',
    phoneNumber: '+9999999999999',
    email: 'doe.10@mail.com',
    password: '123John8',
    created_at: new Date(),
  };

  const contact = {
    id: '65156ds156f1cd5s61fcds',
    name: 'Johnnnnnnn',
    phoneNumber: '+9999999999999',
    userId: 'ds1f65ds1fd3s51fds65',
  };

  let addContactUseCase;
  beforeEach(() => {
    addContactUseCase = new AddContactUseCase(
      mockedContactsRepository,
      mockedUsersRepository,
    );
  });

  it('if the requested user exists, should create and return a friend request', async () => {
    mockedUsersRepository.findOne.mockResolvedValue(contact.phoneNumber);
    mockedContactsRepository.create.mockResolvedValue(contact);

    const newContact = await addContactUseCase.execute(user.id, {
      contactName: contact.name,
      contactPhoneNumber: contact.phoneNumber,
    });

    expect(newContact).toEqual(contact);
  });

  it('If the requested user does not exists, should throw an NotFoundError with message: requested user not found', async () => {
    mockedUsersRepository.findOne.mockResolvedValue(null);

    const newContact = addContactUseCase.execute(user.id, {
      contactName: contact.name,
      contactPhoneNumber: contact.phoneNumber,
    });

    await expect(newContact).rejects.toBeInstanceOf(NotFoundError);
    await expect(newContact).rejects.toThrow(
      new NotFoundError('user with phone number "+9999999999999" not found'),
    );
  });
});
