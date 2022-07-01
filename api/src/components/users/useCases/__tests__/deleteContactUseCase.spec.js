import { NotFoundError } from '../../../../shared/errors';
import { DeleteContactUseCase } from '../DeleteContactUseCase';

describe('DeleteContactUseCase', () => {
  const mockedContactsRepository = {
    findFirst: jest.fn(),
    delete: jest.fn(),
  };

  let deleteContactUseCase;
  beforeEach(() => {
    deleteContactUseCase = new DeleteContactUseCase(mockedContactsRepository);
  });

  const contact = {
    id: '65156ds156f1cd5s61fcds',
    name: 'Johnnnnnnn',
    phoneNumber: '+9999999999999',
    userId: 'ds1f65ds1fd3s51fds65',
  };

  it('If the contact exists, should delete with success', async () => {
    mockedContactsRepository.findFirst.mockResolvedValue(contact);
    mockedContactsRepository.delete.mockResolvedValue(contact);

    const isDeleted = await deleteContactUseCase.execute({
      userId: contact.userId,
      contactNumber: contact.phoneNumber,
    });

    expect(isDeleted).toEqual(true);
  });

  it('If the contact does not exists, should throw an NotFoundError with message: contact not found', async () => {
    mockedContactsRepository.findFirst.mockResolvedValue(null);

    const deletedContact = deleteContactUseCase.execute({
      userId: contact.userId,
      contactNumber: contact.phoneNumber,
    });

    await expect(deletedContact).rejects.toBeInstanceOf(NotFoundError);
    await expect(deletedContact).rejects.toThrow(
      new NotFoundError('contact not found'),
    );
  });
});
