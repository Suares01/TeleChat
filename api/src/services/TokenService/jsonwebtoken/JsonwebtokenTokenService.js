import jsonwebtoken from 'jsonwebtoken';

export class JsonwebtokenTokenService {
  #jsonwebtoken;

  constructor() {
    this.#jsonwebtoken = jsonwebtoken;
  }

  /**
   * Synchronously sign the given payload into a JSON Web Token string payload.
   * @param payload        token payload data
   * @return JWT Token
   */
  sign(payload) {
    const token = this.#jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '15m',
    });

    return token;
  }

  /**
   * Synchronously sign the given payload into a JSON Web Token string payload.
   * @param token       token that will be decoded
   * @return Decoded token
   */
  verify(token) {
    const { exp, header, payload, signature } = this.#jsonwebtoken.verify(
      token,
      process.env.TOKEN_SECRET,
    );

    return { exp, header, payload, signature };
  }
}
