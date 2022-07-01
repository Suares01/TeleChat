import { NotFoundError } from '../../../../shared/errors';
import { ChangeContactNameUseCase } from '../ChangeContactNameUseCase';

describe('ChangeContactNameUseCase', () => {
  const mockedContactsRepository = {
    findFirst: jest.fn(),
    update: jest.fn(),
  };

  let changeContactNameUseCase;
  beforeEach(() => {
    changeContactNameUseCase = new ChangeContactNameUseCase(
      mockedContactsRepository,
    );
  });

  const contact = {
    id: '65156ds156f1cd5s61fcds',
    name: 'Johnnnnnnn',
    phoneNumber: '+9999999999999',
    userId: 'ds1f65ds1fd3s51fds65',
  };

  it('If the contact exists, should update the name and return the updated contact', async () => {
    const conatctWithNewName = {
      ...contact,
      name: 'new name',
    };
    mockedContactsRepository.findFirst.mockResolvedValue(contact);
    mockedContactsRepository.update.mockResolvedValue(conatctWithNewName);

    const updatedContact = await changeContactNameUseCase.execute({
      userId: contact.userId,
      contactNumber: contact.phoneNumber,
      newName: 'new name',
    });

    expect(updatedContact).toEqual(conatctWithNewName);
  });

  it('If the contact does not exists, should throw an NotFoundError with message: contact not found', async () => {
    mockedContactsRepository.findFirst.mockResolvedValue(null);

    const updatedContact = changeContactNameUseCase.execute({
      userId: contact.userId,
      contactNumber: contact.phoneNumber,
      newName: 'new name',
    });

    await expect(updatedContact).rejects.toBeInstanceOf(NotFoundError);
    await expect(updatedContact).rejects.toThrow(
      new NotFoundError('contact not found'),
    );
  });
});
