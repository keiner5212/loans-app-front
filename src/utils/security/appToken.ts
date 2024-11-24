import { encryptContent } from "../cryptography/cryptography";

export function generateAppToken(): string {
    const datePart = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const randomPart = Math.floor(Math.random() * (5000000000 - 1000000000 + 1)) + 1000000000;
    const identifier = `app-${Math.random().toString(36).substring(2, 8)}`; // Identificador único basado en caracteres aleatorios

    const token = `${datePart},${randomPart},${identifier}`;

    return encryptContent(token);
}
