import jsonwebtoken from 'jsonwebtoken';

import { RefreshToken } from './RefreshToken';

export class JsonwebtokenTokenService {
  #jsonwebtoken;

  constructor() {
    this.#jsonwebtoken = jsonwebtoken;
    this.refreshToken = new RefreshToken();
  }

  /**
   * Sign the given payload into a JSON Web Token string payload.
   * @param email   user's email
   * @param userId  user's id
   * @return access token
   */
  sign({ email, userId }) {
    const token = this.#jsonwebtoken.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        issuer: 'api_url',
        algorithm: 'HS256',
        expiresIn: '1h',
        audience: 'TeleChat.API',
        header: {
          typ: 'at+jwt',
        },
        subject: userId,
      },
    );

    return token;
  }

  /**
   * Verify given access token to get a decoded token.
   * @param accessToken       token that will be decoded
   * @return Decoded access token
   */
  verify(accessToken) {
    const { header, payload, signature } = this.#jsonwebtoken.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      {
        complete: true,
        issuer: 'api_url',
        audience: 'TeleChat.API',
        header: {
          typ: 'at+jwt',
        },
      },
    );

    return { header, payload, signature };
  }
}
