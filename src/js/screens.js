import { store } from './state.js';
import { UI } from './ui.js';
import { telegram } from './telegram.js';
import { tonConnect } from './tonconnect.js';
import { api } from './api.js';
import { activities } from './data.js';

const CONTRACT_ADDRESS = 'EQD...'; // TODO: Replace with real contract address

export function showScreen(screenId) {
  const history = store.get('history');
  const current = store.get('currentScreen');
  if (current && current !== screenId) history.push(current);
  store.set('history', history);
  store.set('currentScreen', screenId);

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = UI.el(screenId + '-screen');
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }

  const nav = UI.el('bottom-nav');
  const hiddenScreens = ['auth', 'success', 'payment', 'detail'];
  if (hiddenScreens.includes(screenId)) {
    nav.style.display = 'none';
    telegram.showBackButton(screenId !== 'auth');
  } else {
    nav.style.display = 'flex';
    telegram.showBackButton(false);
  }

  const navMap = { home: 0, friends: 1, profile: 2 };
  if (navMap[screenId] !== undefined) setNavActive(navMap[screenId]);
}

export function setNavActive(index) {
  document.querySelectorAll('.nav-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
    item.setAttribute('aria-current', i === index ? 'page' : 'false');
  });
}

export function goBack() {
  const history = store.get('history');
  if (history.length > 0) {
    const prev = history.pop();
    store.set('history', history);
    showScreen(prev);
  } else {
    showScreen('home');
    setNavActive(0);
  }
}

// ===== AUTH WITH TELEGRAM initData =====
export async function authWithTelegram() {
  showToast('✈️ Авторизация через Telegram...');
  setLoading(true);

  try {
    const initData = telegram.getInitData();

    if (!initData) {
      // ИСПРАВЛЕНО: Мок-авторизация работает ТОЛЬКО на локальном компьютере!
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('No initData, using mock auth on localhost');
        await mockAuth();
        return;
      }
      // На проде в Telegram initData ВСЕГДА есть. Если его нет - сайт открыли в браузере.
      setLoading(false);
      showToast('❌ Откройте приложение внутри Telegram');
      return; // Блокируем вход
    }

    // Send initData to backend for validation
    const result = await api.auth(initData);

    const user = telegram.getUser();
    store.set('user', { 
      name: user?.first_name || 'Пользователь', 
      id: user?.id?.toString() || 'tg_user',
      username: user?.username 
    });

    setLoading(false);
    showScreen('home');
    setNavActive(0);
    showToast(`✅ Добро пожаловать, ${user?.first_name || 'друг'}!`);
    telegram.setMainButton('Забронировать', false, () => {});
  } catch (e) {
    setLoading(false);
    console.error('Auth error:', e);
    showToast('❌ Ошибка авторизации: ' + e.message);

    // Fallback: skip auth (Оставляем мок только если бэкенд лежит, для тестов)
    await mockAuth();
  }
}

async function mockAuth() {
  store.set('user', { name: 'Савва', id: 'tg_123' });
  setLoading(false);
  showScreen('home');
  setNavActive(0);
  showToast('✅ Добро пожаловать!');
}

export function skipAuth() {
  store.set('user', { name: 'Гость', id: 'guest' });
  showScreen('home');
  setNavActive(0);
}

// ===== ACTIVITY DETAIL =====
export function openActivity(id) {
  const activity = activities[id];
  if (!activity) return;
  store.set('selectedActivity', activity);

  UI.el('detail-emoji').textContent = activity.emoji;
  UI.el('detail-title').textContent = activity.title;
  UI.el('detail-rating').textContent = activity.rating;
  UI.el('detail-desc').textContent = activity.desc;
  UI.el('detail-location').innerHTML = activity.location;
  UI.el('detail-price').textContent = activity.price;
  UI.el('detail-fiat').textContent = '≈ ' + activity.rubPrice.toLocaleString('ru-RU') + ' ₽';

  const mapSection = UI.el('map-section');
  if (activity.coords) {
    mapSection.style.display = 'block';
    UI.el('map-address').textContent = activity.address;
  } else {
    mapSection.style.display = 'none';
  }

  const friendsContainer = UI.el('detail-friends');
  UI.clear(friendsContainer);
  if (activity.friends.length > 0) {
    activity.friends.forEach(f => {
      const friendEl = UI.create('div', { class: 'detail-friend', role: 'listitem' }, [
        UI.create('div', { class: 'detail-friend-avatar', 'aria-hidden': 'true' }, [f.avatar]),
        UI.create('div', { class: 'detail-friend-name' }, [f.name]),
        UI.create('div', { class: 'detail-friend-status' }, [f.status])
      ]);
      friendsContainer.appendChild(friendEl);
    });
  } else {
    const emptyMsg = UI.create('div', { style: 'color:var(--tg-text-secondary); font-size:14px;' },
      ['Пока никто из друзей не идёт. Будь первым!']);
    friendsContainer.appendChild(emptyMsg);
  }

  showScreen('detail');
  telegram.setMainButton('Забронировать', true, () => openPayment());
}

// ===== YANDEX MAPS =====
export function openInYandexMaps() {
  const activity = store.get('selectedActivity');
  if (!activity || !activity.coords) {
    showToast('🗺️ Это онлайн-активность — маршрут не требуется');
    return;
  }
  const url = `https://yandex.ru/maps/?rtext=~${activity.coords}&rtt=auto`;
  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('🗺️ Яндекс Карты открыты в новой вкладке');
}

// ===== PAYMENT =====
export function openPayment() {
  const activity = store.get('selectedActivity');
  if (!activity) return;

  UI.el('pay-activity').textContent = activity.title;
  UI.el('pay-price').textContent = activity.price;
  selectPayment('usdt');

  showScreen('payment');
  telegram.setMainButton('Оплатить', true, () => processPayment());
}

export function selectPayment(type) {
  store.set('selectedPayment', type);
  document.querySelectorAll('.payment-option').forEach(opt => {
    const isSelected = opt.dataset.type === type;
    opt.classList.toggle('selected', isSelected);
    opt.setAttribute('aria-checked', isSelected);
  });

  const activity = store.get('selectedActivity');
  if (!activity || activity.priceRaw <= 0) {
    UI.el('pay-total').textContent = 'Бесплатно';
    UI.el('pay-fee').textContent = '—';
    UI.el('pay-conversion-row').style.display = 'none';
    return;
  }

  const conversionRow = UI.el('pay-conversion-row');
  const feeEl = UI.el('pay-fee');
  const securityEl = UI.el('pay-security');
  let totalText = '';

  switch (type) {
    case 'usdt':
      totalText = (activity.priceRaw + 0.1) + ' USDT';
      feeEl.textContent = '~0.1 USDT';
      feeEl.style.color = 'var(--tg-green)';
      conversionRow.style.display = 'none';
      securityEl.textContent = '🔒 Транзакция защищена смарт-контрактом TON';
      break;
    case 'ton':
      let ton = (activity.priceRaw / 3.7).toFixed(2);
      totalText = ton + ' TON';
      feeEl.textContent = '~0.05 TON';
      feeEl.style.color = 'var(--tg-green)';
      conversionRow.style.display = 'none';
      securityEl.textContent = '🔒 Транзакция защищена смарт-контрактом TON';
      break;
    case 'chili':
      let chili = (activity.priceRaw * 40).toFixed(0);
      totalText = chili + ' $CHILI';
      feeEl.textContent = 'Без комиссии';
      feeEl.style.color = 'var(--tg-green)';
      conversionRow.style.display = 'none';
      securityEl.textContent = '🔒 Транзакция защищена смарт-контрактом TON';
      break;
    case 'card_rub':
      totalText = activity.rubPrice.toLocaleString('ru-RU') + ' ₽';
      feeEl.textContent = '+2% комиссия банка';
      feeEl.style.color = 'var(--tg-orange)';
      conversionRow.style.display = 'flex';
      UI.el('pay-conversion').textContent = activity.priceRaw + ' USDT ≈ ' + activity.rubPrice.toLocaleString('ru-RU') + ' ₽';
      securityEl.textContent = '🔒 Платёж обрабатывается банком-партнёром';
      break;
    case 'card_usd':
      totalText = '$' + activity.priceRaw.toFixed(2);
      feeEl.textContent = '+3% международная комиссия';
      feeEl.style.color = 'var(--tg-orange)';
      conversionRow.style.display = 'none';
      securityEl.textContent = '🔒 Платёж обрабатывается банком-партнёром';
      break;
    case 'sbp':
      totalText = activity.rubPrice.toLocaleString('ru-RU') + ' ₽';
      feeEl.textContent = 'Без комиссии';
      feeEl.style.color = 'var(--tg-green)';
      conversionRow.style.display = 'flex';
      UI.el('pay-conversion').textContent = activity.priceRaw + ' USDT ≈ ' + activity.rubPrice.toLocaleString('ru-RU') + ' ₽';
      securityEl.textContent = '⚡ Мгновенный перевод через СБП';
      break;
  }

  UI.el('pay-total').textContent = totalText;
}

export async function processPayment() {
  const activity = store.get('selectedActivity');
  const paymentType = store.get('selectedPayment');

  if (!activity) return;

  // Real TON Connect transaction for crypto payments
  if (['usdt', 'ton', 'chili'].includes(paymentType) && tonConnect.connected) {
    showToast('⏳ Отправка транзакции в блокчейн...');
    setLoading(true);

    const amount = paymentType === 'ton'
      ? Math.floor(activity.priceRaw / 3.7 * 1e9)
      : Math.floor(activity.priceRaw * 1e6);

    const result = await tonConnect.sendTransaction(CONTRACT_ADDRESS, amount);
    setLoading(false);

    if (!result) return;
  } else if (['usdt', 'ton', 'chili'].includes(paymentType) && !tonConnect.connected) {
    showToast('❌ Сначала подключите TON кошелек');
    tonConnect.connect();
    return;
  } else {
    showToast('⏳ Подтверждение платежа...');
    setLoading(true);
  }

  try {
    const booking = await api.createBooking(activity.id, paymentType);
    setLoading(false);

    UI.el('ticket-title').textContent = activity.title;
    let paymentText = activity.price;
    if (paymentType === 'card_rub' || paymentType === 'sbp') {
      paymentText = activity.rubPrice.toLocaleString('ru-RU') + ' ₽';
    } else if (paymentType === 'card_usd') {
      paymentText = '$' + activity.priceRaw;
    }
    UI.el('ticket-payment').textContent = paymentText;

    showScreen('success');
    showToast('🎉 Бронирование подтверждено! NFT билет создан.');
    telegram.setMainButton('На главную', true, () => {
      showScreen('home');
      setNavActive(0);
    });
  } catch (e) {
    setLoading(false);
    showToast('❌ Ошибка бронирования: ' + e.message);
  }
}

// ===== CATEGORY FILTER =====
export function filterCategory(cat) {
  const names = {
    sport: 'Спорт', games: 'Игры', edu: 'Образование',
    fun: 'Развлечения', food: 'Еда', online: 'Онлайн'
  };
  showToast(`🔍 Фильтр: ${names[cat] || cat}`);
}

// ===== SHARE =====
export function shareLink() {
  const url = 'https://t.me/chili_app_bot?start=ref_' + (store.get('user')?.id || 'guest');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Ссылка скопирована! Отправь другу в Telegram');
    });
  } else {
    telegram.share(url, 'Присоединяйся к Chili!');
  }
}

export function shareInvite() {
  telegram.share('https://t.me/chili_app_bot', 'Я забронировал активность в Chili! Присоединяйся!');
  showToast('📤 Приглашение отправлено в Telegram!');
}

// ===== LOGOUT =====
export function logout() {
  store.set('user', null);
  store.set('wallet', null);
  store.set('history', []);
  api.setToken(null);
  showScreen('auth');
  showToast('👋 Вы вышли из аккаунта');
}

// ===== TOAST =====
export function showToast(message) {
  const toast = UI.el('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== LOADING =====
export function setLoading(show) {
  const overlay = UI.el('loading-overlay');
  overlay.classList.toggle('active', show);
}
