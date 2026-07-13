export function getChannel(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('channel') || '';
}
