export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/uploads')) {
    const apiHost = import.meta.env?.VITE_API_HOST || 'http://localhost:5001';
    return `${apiHost}${path}`;
  }
  return path;
};
