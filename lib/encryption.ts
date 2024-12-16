import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'PCiopFYMKSFCXCpIjoyNSzjXD2BUxOZx';

export const encryptData = (data: any): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

export const setEncryptedItem = (key: string, value: any): void => {
    try {
        const encrypted = encryptData(value);
        sessionStorage.setItem(key, encrypted);
    } catch (error) {
        console.error('Error storing encrypted item:', error);
    }
};

export const getEncryptedItem = (key: string): any => {
    try {
        const encrypted = sessionStorage.getItem(key);
        if (!encrypted) return null;
        
        return decryptData(encrypted);
    } catch (error) {
        console.error('Error retrieving encrypted item:', error);
        return null;
    }
};