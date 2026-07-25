// Cloudflare Pages Function — Backend API for Chili
// Endpoint: /api/*

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate Telegram initData
  if (url.pathname === '/api/auth') {
    return handleAuth(request, env, corsHeaders);
  }

  if (url.pathname === '/api/activities') {
    return handleActivities(request, corsHeaders);
  }

  if (url.pathname.startsWith('/api/booking')) {
    return handleBooking(request, env, corsHeaders);
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

async function handleAuth(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const { initData } = await request.json();

  // Validate initData signature
  const isValid = await validateInitData(initData, env.BOT_TOKEN);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid init data' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Generate JWT (simplified — в production используй jose или аналог)
  const token = btoa(JSON.stringify({ user: 'savva', exp: Date.now() + 86400000 }));

  return new Response(JSON.stringify({ token }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleActivities(request, corsHeaders) {
  const activities = [
    { id: 'football', title: 'Футбол', price: 25, currency: 'USDT' },
    { id: 'yoga', title: 'Йога', price: 15, currency: 'USDT' },
    { id: 'quest', title: 'Квест', price: 40, currency: 'USDT' },
  ];

  return new Response(JSON.stringify(activities), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleBooking(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const body = await request.json();

  // В production: создать платёж, mint NFT, отправить уведомление
  const booking = {
    id: 'nft_' + Date.now(),
    status: 'confirmed',
    txHash: 'mock_' + crypto.randomUUID(),
    ...body
  };

  return new Response(JSON.stringify(booking), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function validateInitData(initData, botToken) {
  // HMAC-SHA256 validation
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const secret = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken));

  const checkKey = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const checkHash = await crypto.subtle.sign('HMAC', checkKey, encoder.encode(dataCheckString));
  const checkHashHex = Array.from(new Uint8Array(checkHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return hash === checkHashHex;
}
