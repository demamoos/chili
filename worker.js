// ===== MAIN WORKER ENTRY POINT =====
// ИСПРАВЛЕНО: Теперь Worker сам обрабатывает API запросы 
// и отдает статику (dist) для остальных URL.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. ТЕСТОВЫЙ ЭНДПОИНТ (Чтобы проверить, жив ли Worker)
    if (url.pathname === '/api/ping' || url.pathname === '/api/ping/') {
      return new Response(JSON.stringify({ status: 'ok', message: 'Worker is alive!' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. API Routes (Наш бэкенд)
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, url);
    }

    // 4. Static Assets (Frontend из папки dist)
    // Если запрос не к API, мы просим Cloudflare отдать статику
    // (index.html, JS, CSS). Это заменяет SPA fallback.
    return env.ASSETS.fetch(request);
  }
};

async function handleApiRequest(request, env, url) {
  // Auth endpoint
  if (url.pathname === '/api/auth' || url.pathname === '/api/auth/') {
    return handleAuth(request, env);
  }

  // Activities endpoint
  if (url.pathname === '/api/activities' || url.pathname === '/api/activities/') {
    return handleActivities();
  }

  // Booking endpoint
  if (url.pathname.startsWith('/api/booking')) {
    return handleBooking(request, env);
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// ===== HANDLERS (Взято из нашего старого [[path]].js) =====

async function handleAuth(request, env) {
  if (request.method !== 'POST') {
    // Мы наконец-то видим этот 405! Если он появится сейчас, значит fetch реально шлет GET.
    return new Response(JSON.stringify({ error: `Method not allowed. Received: ${request.method}` }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  const { initData, location, acceptedTerms } = body;

  if (!acceptedTerms) {
    return new Response(JSON.stringify({ error: 'Terms not accepted' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const isValid = await validateInitData(initData, env.BOT_TOKEN);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid init data' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const urlParams = new URLSearchParams(initData);
  const userJsonStr = urlParams.get('user');
  const telegramUser = JSON.parse(userJsonStr || '{}');

  const tokenPayload = { userId: telegramUser.id, userName: telegramUser.first_name, location: location, exp: Date.now() + 86400000 };
  const token = btoa(JSON.stringify(tokenPayload));

  return new Response(JSON.stringify({ token, user: telegramUser }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleActivities() {
  const activities = [
    { id: 'football', title: 'Футбол с друзьями', yandexCategory: 'Спорт', subCategory: 'Командный спорт', price: 0, currency: 'FREE', emoji: '⚽', coords: '24.8466,55.3606', friends: ['Дмитрий'] },
    { id: 'yoga', title: 'Утренняя йога в парке', yandexCategory: 'Спорт', subCategory: 'Фитнес и йога', price: 0, currency: 'FREE', emoji: '🧘‍♀️', coords: '41.0378,28.9853', friends: ['Мария'] },
    { id: 'quest', title: 'Квест «Побег из Алькатраса»', yandexCategory: 'Развлечения', subCategory: 'Квесты', price: 0, currency: 'FREE', emoji: '🗝️', coords: '55.7614,37.6041', friends: [] },
    { id: 'cs2', title: 'CS2 Турнир «Crypto Cup»', yandexCategory: 'Развлечения', subCategory: 'Игры и турниры', price: 0, currency: 'FREE', emoji: '🎮', coords: null, friends: ['Иван'] },
    { id: 'wine', title: 'Винная дегустация', yandexCategory: 'Еда', subCategory: 'Дегустации и рестораны', price: 0, currency: 'FREE', emoji: '🍷', coords: '25.0772,55.1334', friends: ['Анна'] },
    { id: 'nft', title: 'Вебинар: NFT для начинающих', yandexCategory: 'Образование', subCategory: 'Вебинары и курсы', price: 0, currency: 'FREE', emoji: '🎨', coords: null, friends: [] },
    { id: 'hiking', title: 'Поход в горы Аль-Айн', yandexCategory: 'Туризм', subCategory: 'Экскурсии и походы', price: 0, currency: 'FREE', emoji: '🏔️', coords: '24.1935,55.7584', friends: [] },
    { id: 'dog_park', title: 'Встреча собаководов в парке', yandexCategory: 'Домашние животные', subCategory: 'Дог-парки и выставки', price: 0, currency: 'FREE', emoji: '🐕', coords: '25.2100,55.2700', friends: [] }
  ];
  return new Response(JSON.stringify(activities), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleBooking(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }
  const body = await request.json();
  const booking = {
    id: 'nft_' + Date.now(),
    status: 'confirmed',
    txHash: 'free_mock_' + crypto.randomUUID(),
    paymentType: 'free_nft',
    yandexCategory: body.yandexCategory || 'Спорт',
    ...body
  };
  return new Response(JSON.stringify(booking), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function validateInitData(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  const dataCheckString = [...urlParams.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('\n');
  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey('raw', encoder.encode('WebAppData'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const secret = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken));
  const checkKey = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const checkHash = await crypto.subtle.sign('HMAC', checkKey, encoder.encode(dataCheckString));
  const checkHashHex = Array.from(new Uint8Array(checkHash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hash === checkHashHex;
}