// Date locale du jour au format YYYY-MM-DD (et non la date UTC de toISOString)
export function today(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Vrai si a est strictement avant b (format zéro-paddé : l'ordre des chaînes = l'ordre chronologique)
export function isBefore(a: string, b: string): boolean {
  return a < b;
}

// 'YYYY-MM-DD' -> 'JJ/MM/AAAA' ; entrée invalide renvoyée telle quelle
export function formatFr(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) {
    return iso;
  }
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
