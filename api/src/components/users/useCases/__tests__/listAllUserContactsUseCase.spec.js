import { ListAllUserContactsUseCase } from '../ListAllUserContactsUseCase';

describe('ListAllUserContactsUseCase', () => {
  const mockedContactsRepository = {
    findMany: jest.fn(),
  };

  let listAllUserContactsUseCase;
  beforeEach(() => {
    listAllUserContactsUseCase = new ListAllUserContactsUseCase(
      mockedContactsRepository,
    );
  });

  it('should return all users contacts', async () => {
    const defaultContacts = [
      {
        id: '65156ds156f1cd5s61fcds',
        name: 'Johnnnnnnn',
        phoneNumber: '+9999999999999',
        userId: 'ds1f65ds1fd3s51fds65',
      },
      {
        id: '1f89sd4f65ds1f5cd',
        name: 'Johnnnnnnn2',
        phoneNumber: '+8888888888888',
        userId: 'ds1f65ds1fd3s51fds65',
      },
    ];
    mockedContactsRepository.findMany.mockResolvedValue(defaultContacts);

    const contacts = await listAllUserContactsUseCase.execute('user_id');

    expect(contacts).toEqual(defaultContacts);
  });
});
