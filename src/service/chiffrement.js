import crypto from "crypto"



export function encrypt(string) {
    try {
        const ALGO = 'aes-256-gcm';
        const KEY = Buffer.from(process.env.SECRET_KEY, 'hex');
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGO, KEY, iv);

        const encrypted = Buffer.concat([
            cipher.update(string, 'utf8'),
            cipher.final()
        ]);

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
            tag: cipher.getAuthTag().toString('hex')
        };
    } catch (err) {
        console.log(err)
    }
}

export function decrypt(encrypted) {
    try {
        const ALGO = 'aes-256-gcm';
        const KEY = Buffer.from(process.env.SECRET_KEY, 'hex');
        const decipher = crypto.createDecipheriv(
            ALGO,
            KEY,
            Buffer.from(encrypted.iv, 'hex')
        );

        decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));

        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encrypted.content, 'hex')),
            decipher.final()
        ]);
        const passwordDecrypted = decrypted.toString('utf8');
        return passwordDecrypted
    } catch (err) {
        console.log(err)
    }
}