const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '');

export default function resolveImageUrl(src) {
  if (typeof src !== 'string' || !src) return src;
  if (src.startsWith('/uploads/')) return `${apiOrigin}${src}`;
  return src;
}
