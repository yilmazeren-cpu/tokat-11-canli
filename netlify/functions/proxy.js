// Tokat Canlı Otobüs Takip v3 - Sıfır Bağımlılıklı Kentkart CORS Proxy (Netlify Functions)
// Node.js 18+ dahili fetch API kullanır; package.json veya axios gerekmez.

const KENTKART_BASE = 'https://service.kentkart.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Content-Type': 'application/json; charset=utf-8',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Yalnızca GET istekleri desteklenir.' }),
    };
  }

  try {
    const rawPath = event.path || '';
    const cleanPath = rawPath
      .replace(/^\/\.netlify\/functions\/proxy\/?/, '')
      .replace(/^\/api\/?/, '')
      .replace(/^\/+/, '');

    if (cleanPath === 'health' || cleanPath === '') {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          ok: true,
          version: 'v3',
          service: 'tokat-kentkart-proxy',
          runtime: process.version,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    if (cleanPath.includes('..') || !/^(rl1|api)\//i.test(cleanPath)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Geçersiz Kentkart API yolu.',
          receivedPath: cleanPath,
        }),
      };
    }

    let queryString = '';
    if (event.rawQuery && event.rawQuery.length > 0) {
      queryString = `?${event.rawQuery}`;
    } else if (event.queryStringParameters && Object.keys(event.queryStringParameters).length > 0) {
      const params = new URLSearchParams(event.queryStringParameters);
      queryString = `?${params.toString()}`;
    }

    const targetUrl = `${KENTKART_BASE}/${cleanPath}${queryString}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    let upstream;
    try {
      upstream = await fetch(targetUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
          'Origin': 'https://m.kentkart.com',
          'Referer': 'https://m.kentkart.com/',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const bodyText = await upstream.text();

    return {
      statusCode: upstream.status,
      headers: {
        ...CORS_HEADERS,
        'X-Upstream-Status': String(upstream.status),
        'X-Upstream-Path': cleanPath,
      },
      body: bodyText,
    };
  } catch (err) {
    const isTimeout = err && err.name === 'AbortError';
    return {
      statusCode: isTimeout ? 504 : 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: isTimeout
          ? 'Kentkart sunucusu zaman aşımına uğradı (14sn).'
          : 'Kentkart API bağlantısı kurulamadı.',
        detail: err ? String(err.message || err) : 'Bilinmeyen hata',
      }),
    };
  }
};
