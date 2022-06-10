import bcryptjs from 'bcryptjs';

export class BcryptjsHashService {
  #bcryptjs;

  constructor() {
    this.#bcryptjs = bcryptjs;
  }

  /**
   * Asynchronously generates a hash for the given string.
   * @param value                String to hash
   * @return Promise with resulting hash
   */
  async hash(value) {
    const salt = await this.#bcryptjs.genSalt(8);

    const hash = await this.#bcryptjs.hash(value, salt);

    return hash;
  }

  /**
   * Compares the given data against the given hash.
   * @param  value            Data to compare
   * @param  hash             Data to be compared to
   * @return Promise with resulting compare
   */
  async compare(value, hash) {
    const result = await this.#bcryptjs.compare(value, hash);

    return result;
  }
}
