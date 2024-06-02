import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';


@Injectable()
export class EncryptionService {
    private encryptionKey = process.env.ENCRYPTION_KEY;
    private encryptionMode = 'aes-256-ctr';

    async encrypt(textToEncrypt) {
        const iv = randomBytes(16);
        const key = (await promisify(scrypt)(this.encryptionKey, 'salt', 32)) as Buffer;
        const cipher = createCipheriv(this.encryptionMode, key, iv);
        
        let encrypted = cipher.update(textToEncrypt, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return { encrypted, iv };
    }
    async decrypt(encryptedText, iv) {
      const key = (await promisify(scrypt)(this.encryptionKey, 'salt', 32)) as Buffer;
      const decipher = createDecipheriv(this.encryptionMode, key, iv);

      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    }
}