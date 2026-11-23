// Types de retour et message d'erreur communs à la couche de stockage
export const STORAGE_ERROR_MESSAGE = 'Impossible d\'enregistrer les données. Réessayez.';

export type StorageResult = { ok: true } | { ok: false; message: string };

export type StorageReadResult<T> = { ok: true; value: T } | { ok: false; message: string };
