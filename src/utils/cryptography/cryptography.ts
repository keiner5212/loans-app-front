import { AES, enc } from 'crypto-js';

/**
 * Encrypt message
 * @param content string
 * @returns string
 * */
export function encryptContent(content: string): string {
    const secretKey = import.meta.env.VITE_CRYPTO_SECRET
    if (!secretKey) {
        throw new Error('Secret key is not defined');
    }
    const cipherText = AES.encrypt(content, secretKey).toString();
    return cipherText;
}

/**
 * Decrypt cipherText
 * @param cipherText string
 * @returns string
 * */
export function decryptContent(cipherText?: string): string {
    if (!cipherText) {
        throw new Error('Cipher text is required');
    }
    const secretKey = import.meta.env.VITE_CRYPTO_SECRET
    if (!secretKey) {
        throw new Error('Secret key is not defined');
    }
    const bytes = AES.decrypt(cipherText, secretKey);
    const originalText = bytes.toString(enc.Utf8);
    return originalText;
}