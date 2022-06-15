import jsonwebtoken from 'jsonwebtoken';

export class RefreshToken {
  #jsonwebtoken;

  constructor() {
    this.#jsonwebtoken = jsonwebtoken;
  }

  /**
   * Refresh token sign.
   * @param userId user's id
   * @return refresh token
   */
  sign(userId) {
    const refreshToken = this.#jsonwebtoken.sign(
      {},
      process.env.REFRESH_TOKEN_SECRET,
      {
        algorithm: 'HS256',
        audience: 'TeleChat.API',
        expiresIn: '15d',
        issuer: 'api_url',
        header: {
          typ: 'rt+jwt',
        },
        subject: userId,
      },
    );

    return refreshToken;
  }

  /**
   * Verify given refresh token to get a decoded token.
   * @param refreshToken token that will be decoded
   * @return Decoded refresh token
   */
  verify(refreshToken) {
    const { header, payload, signature } = this.#jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      {
        complete: true,
        audience: 'TeleChat.API',
        issuer: 'api_url',
        header: {
          typ: 'rt+jwt',
        },
      },
    );

    return { header, payload, signature };
  }
}
