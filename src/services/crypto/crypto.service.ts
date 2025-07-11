import * as CryptoJS from "crypto-js";

export class MyCrypto {

  private secret: String;

  constructor(secret: String) {
    this.secret = secret;
  }

  getSha256(message: String) {
    const hash = CryptoJS.SHA256(message);
    return hash.toString(CryptoJS.enc.Hex);
  }

  getHmacMd5(message: String) {
    var hash = CryptoJS.HmacMD5(message, this.secret);
    return hash.toString(CryptoJS.enc.Hex);
  }

  getHmacSha256(message: String) {
    var hash = CryptoJS.HmacSHA256(message, this.secret);
    return hash.toString(CryptoJS.enc.Hex);
  }

  encryptAes(message: String) {
    var encrypted = CryptoJS.AES.encrypt(message, this.secret);
    return encrypted.toString();
  }

  decryptAes(decryptedMessage: String) {
    var decrypted = CryptoJS.AES.decrypt(decryptedMessage, this.secret);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}