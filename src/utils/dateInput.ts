// Conversions Date <-> 'YYYY-MM-DD' en heure locale (jamais en UTC).

// Composantes locales : la conversion UTC décalerait d'un jour selon le fuseau.
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Minuit local : new Date('YYYY-MM-DD') serait interprétée en UTC.
export function fromIsoDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}
