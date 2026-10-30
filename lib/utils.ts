/**
 * Trims leading and trailing whitespace from a title.
 *
 * @param title - The title to normalize.
 * @returns The title without surrounding whitespace.
 */
export function formatTitle(title: string): string {
  return title.trim();
}