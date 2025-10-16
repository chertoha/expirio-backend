export function calculateSkip(page = 1, limit = 10): number {
  return (page - 1) * limit;
}
