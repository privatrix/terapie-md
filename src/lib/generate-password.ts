/**
 * Generate a secure temporary password
 * @returns A 12-character random password
 */
export function generateTempPassword(): string {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    // Use crypto for secure random values
    const values = new Uint32Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(values);
    } else if (typeof global !== 'undefined' && global.crypto) {
        global.crypto.getRandomValues(values);
    } else {
        // Fallback for environments without crypto
        for (let i = 0; i < length; i++) {
            values[i] = Math.floor(Math.random() * charset.length);
        }
    }

    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
    }

    return password;
}
