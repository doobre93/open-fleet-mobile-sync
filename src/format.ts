export function splitPlace(place: string): { city: string; country: string | null } {
  const match = place.match(/^(.*?),\s*([A-Z]{2})$/);
  return match ? {city: match[1]!, country: match[2]!} : {city: place, country: null};
}

export function cargoParts(cargo: string): string[] {
  return cargo.split('·').map(part => part.trim()).filter(Boolean);
}

export function firstName(name: string): string {
  return name.split(' ')[0] ?? name;
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Late shift';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function todayStamp(date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: '2-digit', month: 'short'}).format(date).toUpperCase();
}

export function distance(km: number | null): string {
  return km === null ? '— km' : `${km.toLocaleString('en-GB')} km`;
}
