import crypto from 'crypto';

class HashPassword {
  private hash(algorithm: string, text: string) {
    return crypto.createHash(algorithm).update(text).digest('hex');
  }

  sha512(text: string) {
    return this.hash('sha512', text);
  }
}

export default new HashPassword();
