// Simple SKU generator
// Rules:
// - Build from product name (remove diacritics and non-alphanumerics)
// - Take up to first 3 words, 3 chars each, uppercased
// - Append yymmdd date and 4-char random base36 suffix
export function generateSku(name = 'PRODUCT') {
  try {
    const normalized = String(name)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/[^a-zA-Z0-9 ]/g, ' ') // non-alnum to space
      .trim();

    const parts = normalized.split(/\s+/).filter(Boolean);
    const head = parts.slice(0, 3).map(w => w.slice(0, 3)).join('').toUpperCase();
    const prefix = head || 'PRD';

    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const date = `${yy}${mm}${dd}`;

    const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
    return `${prefix}-${date}-${rand}`;
  } catch {
    return `PRD-${Date.now().toString().slice(-8)}`;
  }
}

export default generateSku;


