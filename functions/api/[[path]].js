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
  // ИСПРАВЛЕНО: Теперь проверяем pathname со слэшем и без слэша
  if (url.pathname === '/api/auth' || url.pathname === '/api/auth/') {
    return handleAuth(request, env, corsHeaders);
  }

  if (url.pathname === '/api/activities' || url.pathname === '/api/activities/') {
    return handleActivities(request, corsHeaders);
  }

  if (url.pathname.startsWith('/api/booking')) { // startsWith покрывает /api/booking и /api/booking/
    return handleBooking(request, env, corsHeaders);
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

async function handleAuth(request, env, corsHeaders) {
 // ИСПРАВЛЕНО: Временно добавили логирование метода прямо в ошибку!
  // Если ошибка появится, мы УВИДИМ какой метод пришел: GET, OPTIONS или что-то еще.
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: `Method not allowed. Received: ${request.method}` }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // ИСПРАВЛЕНО: Теперь мы читаем не только initData, но и location/acceptedTerms
  const body = await request.json();
  const { initData, location, acceptedTerms } = body;

  // ДОБАВЛЕНО: Строгая проверка на сервере! Если юзер не принял правила — доступ запрещен.
  // Даже если он каким-то чудом нажал кнопку "Войти" без чекбокса на фронте, бэкенд его отбросит.
  if (!acceptedTerms) {
    return new Response(JSON.stringify({ error: 'Terms of service not accepted' }), {
      status: 403, // 403 Forbidden — запрет доступа
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Validate initData signature
  const isValid = await validateInitData(initData, env.BOT_TOKEN);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid init data' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // ИСПРАВЛЕНО: Извлекаем РЕАЛЬНЫЕ данные пользователя из initData вместо хардкода 'savva'
  // initData приходит как query string, нам нужно достать параметр "user"
  const urlParams = new URLSearchParams(initData);
  const userJsonStr = urlParams.get('user');
  const telegramUser = JSON.parse(userJsonStr || '{}');

  // Generate JWT (simplified — в production используй jose или аналог)
  // Теперь токен содержит настоящий Telegram ID и имя!
  const tokenPayload = { 
    userId: telegramUser.id, 
    userName: telegramUser.first_name, 
    location: location, // Сохраняем геолокацию в токен (или в базу данных в будущем)
    exp: Date.now() + 86400000 
  };
  const token = btoa(JSON.stringify(tokenPayload));

  // ДОБАВЛЕНО: Возвращаем объект пользователя на фронтенд, чтобы фронт сразу мог подставить имя
  return new Response(JSON.stringify({ token, user: telegramUser }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}


async function handleActivities(request, corsHeaders) {
  // ИСПРАВЛЕНО: Структура активностей переработана под Яндекс.Категории
  // Добавлены: Еда, Туризм, Развлечения, Образование, Спорт, Домашние животные
  // Каждая активность теперь содержит yandexCategory и subCategory
  const activities = [
    // СПОРТ
    { id: 'football', title: 'Футбол с друзьями', yandexCategory: 'Спорт', subCategory: 'Командный спорт', price: 0, currency: 'FREE', emoji: '⚽', coords: '24.8466,55.3606', friends: ['Дмитрий'] },
    { id: 'yoga', title: 'Утренняя йога в парке', yandexCategory: 'Спорт', subCategory: 'Фитнес и йога', price: 0, currency: 'FREE', emoji: '🧘‍♀️', coords: '41.0378,28.9853', friends: ['Мария'] },
    // РАЗВЛЕЧЕНИЯ
    { id: 'quest', title: 'Квест «Побег из Алькатраса»', yandexCategory: 'Развлечения', subCategory: 'Квесты', price: 0, currency: 'FREE', emoji: '🗝️', coords: '55.7614,37.6041', friends: [] },
    { id: 'cs2', title: 'CS2 Турнир «Crypto Cup»', yandexCategory: 'Развлечения', subCategory: 'Игры и турниры', price: 0, currency: 'FREE', emoji: '🎮', coords: null, friends: ['Иван'] },
    // ЕДА
    { id: 'wine', title: 'Винная дегустация', yandexCategory: 'Еда', subCategory: 'Дегустации и рестораны', price: 0, currency: 'FREE', emoji: '🍷', coords: '25.0772,55.1334', friends: ['Анна'] },
    // ОБРАЗОВАНИЕ
    { id: 'nft', title: 'Вебинар: NFT для начинающих', yandexCategory: 'Образование', subCategory: 'Вебинары и курсы', price: 0, currency: 'FREE', emoji: '🎨', coords: null, friends: [] },
    // ТУРИЗМ
    { id: 'hiking', title: 'Поход в горы Аль-Айн', yandexCategory: 'Туризм', subCategory: 'Экскурсии и походы', price: 0, currency: 'FREE', emoji: '🏔️', coords: '24.1935,55.7584', friends: [] },
    // ДОМАШНИЕ ЖИВОТНЫЕ
    { id: 'dog_park', title: 'Встреча собаководов в парке', yandexCategory: 'Домашние животные', subCategory: 'Дог-парки и выставки', price: 0, currency: 'FREE', emoji: '🐕', coords: '25.2100,55.2700', friends: [] }
  ];

  return new Response(JSON.stringify(activities), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// ИСПРАВЛЕНО: Бронирование теперь БЕСПЛАТНОЕ (Free NFT)
async function handleBooking(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const body = await request.json();

  // Создаем бесплатный NFT билет (мок)
  const booking = {
    id: 'nft_' + Date.now(),
    status: 'confirmed',
    txHash: 'free_mock_' + crypto.randomUUID(), // Мок хэш, реальной транзакции нет
    paymentType: 'free_nft',
    yandexCategory: body.yandexCategory || 'Спорт',
    ...body
  };

  return new Response(JSON.stringify(booking), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// ... (validateInitData остается как была) ...

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
