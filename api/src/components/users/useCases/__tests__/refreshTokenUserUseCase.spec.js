import { UnauthorizedError } from '../../../../shared/errors';
import { RefreshTokenUserUseCase } from '../RefreshTokenUserUseCase';

describe('RefreshTokenUserUseCase', () => {
  const mockedTokenService = {
    sign: jest.fn(),
    refreshToken: {
      verify: jest.fn(),
    },
  };

  const mockedUsersRepository = {
    findOne: jest.fn(),
  };

  let refreshTokenUserUseCase;
  beforeEach(() => {
    refreshTokenUserUseCase = new RefreshTokenUserUseCase(
      mockedTokenService,
      mockedUsersRepository,
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

  const sampleAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJlbWFpbCI6InRlc3RlQG1haWwuY29tIiwiaWF0IjoxNjU1MjU1ODE5LCJleHAiOjE2NTUyNTU4NzksImF1ZCI6IlRlbGVDaGF0LkFQSSIsImlzcyI6ImFwaV91cmwiLCJzdWIiOiIwN2VkY2RiYi05ZWIxLTQyNjYtYjdmNS01NWQ1ZTk1ZTE2NDkifQ.b7gz29FSL0S5a80YblDpbw7GW1snF9QOhFZ44umFMfQ';
  const sampleRefreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6InJ0K2p3dCJ9.eyJpYXQiOjE2NTUyNTU3MzIsImV4cCI6MTY1NTI1NTkxMiwiYXVkIjoiVGVsZUNoYXQuQVBJIiwiaXNzIjoiYXBpX3VybCIsInN1YiI6IjA3ZWRjZGJiLTllYjEtNDI2Ni1iN2Y1LTU1ZDVlOTVlMTY0OSJ9.-LPvJkP7Shegm3IXzeO-nChGTx-lRQMG7TTilcIIRV8';
  const sampleRefreshTokenPayload = {
    payload: {
      sub: defaultUser.id,
    },
  };

  it('If the refresh token is valid and the user exists, should generate and return a new access token', async () => {
    mockedTokenService.refreshToken.verify.mockReturnValue(
      sampleRefreshTokenPayload,
    );
    mockedUsersRepository.findOne.mockResolvedValue(defaultUser);
    mockedTokenService.sign.mockReturnValue(sampleAccessToken);

    const newAccessToken = await refreshTokenUserUseCase.execute(
      sampleRefreshToken,
    );

    expect(newAccessToken).toBe(sampleAccessToken);
  });

  it('If the refresh token is invalid, should throw UnauthorizedError error with message: refresh token is invalid', async () => {
    mockedTokenService.refreshToken.verify.mockRejectedValue('token error');

    const refreshToken = refreshTokenUserUseCase.execute(sampleRefreshToken);

    await expect(refreshToken).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(refreshToken).rejects.toThrow(
      new UnauthorizedError('refresh token is invalid'),
    );
  });

  it('If the refresh token is valid but the user does not exists, should throw UnauthorizedError error with message: refresh token is invalid', async () => {
    mockedTokenService.refreshToken.verify.mockReturnValue(
      sampleRefreshTokenPayload,
    );
    mockedUsersRepository.findOne.mockResolvedValue(null);

    const refreshToken = refreshTokenUserUseCase.execute(sampleRefreshToken);

    await expect(refreshToken).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(refreshToken).rejects.toThrow(
      new UnauthorizedError('refresh token is invalid'),
    );
  });
});
