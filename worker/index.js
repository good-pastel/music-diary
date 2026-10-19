const PLAYLIST_ID = 'PLY2KXk4Vugn9qO6OErDhCBJsnYZ7Muyss';
const ALLOWED_ORIGINS = new Set([
  'https://good-pastel.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
]);

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return new Response('Origin tidak diizinkan.', { status: 403 });
    }

    const responseOrigin = origin || 'https://good-pastel.github.io';
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': responseOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin',
        },
      });
    }
    if (request.method !== 'GET') {
      return json({ error: 'Metode tidak didukung.' }, 405, responseOrigin);
    }
    if (!env.YOUTUBE_API_KEY) {
      return json({ error: 'Backend belum dikonfigurasi.' }, 500, responseOrigin);
    }

    const requestedToken = new URL(request.url).searchParams.get('pageToken') || '';
    if (requestedToken.length > 2048) {
      return json({ error: 'Token halaman tidak valid.' }, 400, responseOrigin);
    }

    // Cache each playlist page to reduce repeat YouTube API quota use.
    const cacheUrl = new URL('https://music-diary-cache.invalid/playlist');
    if (requestedToken) cacheUrl.searchParams.set('pageToken', requestedToken);
    const cacheRequest = new Request(cacheUrl.toString(), { method: 'GET' });
    const cached = await caches.default.match(cacheRequest);
    if (cached) {
      const body = await cached.json();
      return json(body, 200, responseOrigin);
    }

    const youtubeUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    youtubeUrl.search = new URLSearchParams({
      part: 'snippet',
      playlistId: PLAYLIST_ID,
      maxResults: '50',
      key: env.YOUTUBE_API_KEY,
    }).toString();
    if (requestedToken) youtubeUrl.searchParams.set('pageToken', requestedToken);

    try {
      const youtubeResponse = await fetch(youtubeUrl);
      const youtubeData = await youtubeResponse.json();
      if (!youtubeResponse.ok) {
        return json(
          { error: youtubeData.error?.message || 'YouTube API gagal memuat playlist.' },
          youtubeResponse.status === 403 ? 502 : youtubeResponse.status,
          responseOrigin,
        );
      }

      const result = {
        items: youtubeData.items || [],
        nextPageToken: youtubeData.nextPageToken || '',
      };
      await caches.default.put(
        cacheRequest,
        new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
        }),
      );
      return json(result, 200, responseOrigin);
    } catch (error) {
      return json({ error: 'Tidak dapat menghubungi YouTube saat ini.' }, 502, responseOrigin);
    }
  },
};
