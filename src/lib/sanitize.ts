/**
 * Sanitize HTML by stripping all HTML tags and escaping special characters
 * This is a server-safe alternative to DOMPurify for API routes
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return '';

  // Remove all HTML tags
  let clean = dirty.replace(/<[^>]*>/g, '');

  // Escape special HTML characters
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Trim and normalize whitespace
  return clean.trim().replace(/\s+/g, ' ');
}

export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim();
}
