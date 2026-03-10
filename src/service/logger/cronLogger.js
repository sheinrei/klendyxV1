import fs from 'fs';
import path from 'path';

const LOG_FILE_PATH = path.join(process.cwd(), 'cronLog.jsonl');

/**
 * Log un message dans le fichier cronLog.json
 * @param {object} message - Le message à logger
 */
export function cronLogger(message) {
    const entry = JSON.stringify({ date: new Date().toLocaleString(), ...message }) + "\n"

    fs.appendFile(LOG_FILE_PATH, entry, (err) => {
        if (err) {
            console.error(`[LOG ERROR] Impossible d'écrire dans le fichier: ${err.message}`);
        }
    });
}