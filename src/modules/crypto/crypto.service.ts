import * as crypto from "node:crypto";

export class CryptoService {

  private _def_iv: Buffer = crypto.randomBytes(16);
  private key: crypto.CipherKey;

  constructor(secret: string ) {
    this.key = crypto.createHash('sha256')
      .update(secret)
      .digest();
  }

  getSha256(message: string ) {
    const hash = crypto.createHash('sha256')
      .update(message)
      .digest('hex');
    return hash;
  }

  getMd5(message: string ) {
    var hash = crypto.createHash('md5')
      .update(message)
      .digest('hex');
    return hash;
  }

  getHmacSha256(message: string ) {
    var hmac = crypto.createHmac('sha256', this.key)
      .update(message)
      .digest('hex')
    return hmac;
  }

  getHmacMd5(message: string ) {
    var hmac = crypto.createHmac('md5', this.key)
      .update(message)
      .digest('hex')
    return hmac;
  }

  encryptAes(message: string ) {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this._def_iv);
    cipher.update(message, 'utf8');
    return cipher.final('hex');
  }

  decryptAes(encrMessage: string ) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this._def_iv);
    decipher.write(encrMessage, 'hex');
    return decipher.final('utf8');
  }
}