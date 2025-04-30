import { join } from 'path';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Retrieves user credentials from a local file
 * @param serviceName - The name of the service (e.g., 'gmail', 'drive')
 * @param userId - The user identifier
 * @returns The credentials data object or null if not found
 * TODO: should be read from database
 */
export function getUserCredentials(serviceName: string, userId: string): any | null {
    // Get the project root directory
    const currentFilePath = fileURLToPath(import.meta.url);
    const projectRoot = dirname(dirname(dirname(currentFilePath)));

    const credentialsBaseDir = process.env.CREDENTIALS_DIR || 
        join(projectRoot, 'local_auth', 'credentials');

    const serviceDir = join(credentialsBaseDir, serviceName);
    mkdirSync(serviceDir, { recursive: true });

    const credsPath = join(serviceDir, `${userId}_credentials.json`);

    if (!existsSync(credsPath)) {
        return null;
    }

    try {
        const credentialsData = JSON.parse(readFileSync(credsPath, 'utf8'));
        // The caller is responsible for converting JSON to the appropriate credentials type
        return credentialsData;
    } catch (error) {
        console.error(`Error reading credentials file: ${error}`);
        return null;
    }
}