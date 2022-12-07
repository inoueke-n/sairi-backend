export function createAlphanumericString(length: number): string {
  return Math.random().toString(36).slice(length);
}
