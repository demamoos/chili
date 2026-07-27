import { router } from './router.js';
import { store } from './state.js';
import { telegram } from './telegram.js';
import { tonConnect } from './tonconnect.js';
import { UI } from './ui.js';
import {
  showScreen, setNavActive, goBack, authWithTelegram, // ✅ skipAuth убрана из импортов
  openActivity, openInYandexMaps, openPayment, selectPayment,
  processPayment, filterCategory, shareLink, shareInvite, logout,
  showToast, setLoading
} from './screens.js';

// Make showToast globally available for TON Connect adapter
window.showToast = showToast;

// ===== HTML TEMPLATES =====
const templates = {
  auth: `
    <div id="auth-screen" class="screen active" role="main" aria-label="Экран авторизации">
      <div class="logo-container">
        <span class="logo-emoji" aria-hidden="true">❄️</span>
      </div>
      <h1 class="auth-title">Chili</h1>
      <p class="auth-subtitle">Найди свой досуг. Делай это с друзьями из Telegram.</p>
      
      <!-- ИСПРАВЛЕНО: Добавлен чекбокс для соглашения на обработку данных -->
      <div style="width:100%; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px; padding:0 10px;">
        <input type="checkbox" id="terms-checkbox" style="width:20px; height:20px; margin-top:2px; accent-color:var(--tg-blue); cursor:pointer;" aria-label="Согласие с правилами">
        <label for="terms-checkbox" style="font-size:13px; color:var(--tg-text-secondary); line-height:1.4; cursor:pointer;">
          Я соглашаюсь с <a href="https://chili-app.pages.dev/terms" target="_blank" style="color:var(--tg-blue-light); text-decoration:underline;">условиями использования</a> 
          и <a href="https://chili-app.pages.dev/privacy" target="_blank" style="color:var(--tg-blue-light); text-decoration:underline;">политикой конфиденциальности</a>, 
          включая обработку моей геолокации для поиска мероприятий рядом.
        </label>
      </div>

      <!-- ИСПРАВЛЕНО: Убрана кнопка "Гостевой вход". Вход только через TG -->
      <button class="btn btn-primary" data-action="auth-telegram" aria-label="Войти через Telegram">
        <span aria-hidden="true">✈️</span> Войти через Telegram
      </button>
      
      <div class="features-list">
        <div class="feature-item animate-in delay-1">
          <span class="feature-icon" aria-hidden="true">⚽</span>
          <div class="feature-text">
            <strong>Агрегатор активностей</strong>
            Спорт, игры, квесты, образование — всё в одном месте
          </div>
        </div>
        <div class="feature-item animate-in delay-2">
          <span class="feature-icon" aria-hidden="true">👥</span>
          <div class="feature-text">
            <strong>Друзья из Telegram</strong>
            Узнавай, чем занимаются твои контакты, и присоединяйся
          </div>
        </div>
        <div class="feature-item animate-in delay-3">
          <span class="feature-icon" aria-hidden="true">📍</span>
          <div class="feature-text">
            <strong>Мероприятия рядом</strong>
            Мы найдем лучшие активности ближе к вам
          </div>
        </div>
      </div>
    </div>
  `,

  home: `
    <div id="home-screen" class="screen" role="main" aria-label="Главный экран">
      <div class="screen-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <!-- ИСПРАВЛЕНО: Имя подставляется динамически, id оставлен для screens.js -->
            <div class="header-title" id="home-header-title">Привет! 👋</div>
            <div class="header-subtitle">Чем займёмся сегодня?</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; background:var(--tg-surface); padding:8px 14px; border-radius:20px; border:1px solid var(--tg-border);">
            <span style="font-size:18px;" aria-hidden="true">📍</span>
            <span id="home-user-location" style="font-size:13px; color:var(--tg-text-secondary);">Определяется...</span>
          </div>
        </div>
      </div>

      <!-- НОВОЕ: Секция Избранное (появится только если есть избранное) -->
      <div class="section" id="favorites-section" style="display:none;">
        <div class="section-title">
          <span aria-hidden="true">⭐</span> Избранное
        </div>
        <div id="favorites-container" class="friends-strip"></div>
      </div>

      <div class="section">
        <div class="section-title" aria-hidden="true">📂 Категории</div>
        <!-- НОВОЕ: Контейнер для динамических категорий с бэкенда -->
        <div id="categories-container" class="categories-grid" role="list" aria-label="Категории активностей"></div>
      </div>

      <div class="section">
        <div class="section-title">
          <span aria-hidden="true">✨</span> <span id="activities-title">Все мероприятия</span>
          <button class="section-link" data-action="clear-filter" style="display:none;" aria-label="Сбросить фильтр">Все</button>
        </div>
        <!-- НОВОЕ: Контейнер для динамических карточек активностей -->
        <div id="activities-container" role="list" aria-label="Список активностей"></div>
      </div>
    </div>
  `,
   
  

  detail: `
    <div id="detail-screen" class="screen" role="main" aria-label="Детали активности">
      <div class="detail-hero" id="detail-hero" aria-hidden="true">
        <button class="detail-back" data-action="go-back" aria-label="Назад">←</button>
        <span id="detail-emoji" style="font-size:100px;">⚽</span>
      </div>
      <div class="detail-content">
        <h1 class="detail-title" id="detail-title">Футбол с друзьями</h1>
        <div class="detail-rating">
          <span aria-hidden="true">⭐</span>
          <span id="detail-rating">4.8</span>
          <span style="color:var(--tg-text-secondary)">•</span>
          <span style="color:var(--tg-text-secondary)">128 отзывов</span>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Описание</div>
          <p class="detail-description" id="detail-desc">
            Еженедельный футбол на отличном поле в Al Qudra. Все уровни приветствуются! 
            После игры — социализация и крипто-обсуждения в ближайшем кафе.
          </p>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Дата и место</div>
          <p class="detail-description" id="detail-location">
            📍 Дубай, Al Qudra Sports Complex<br>
            🕖 Четверг, 19:00 — 21:00
          </p>
        </div>
        <div id="map-section" class="detail-section">
          <div class="detail-section-title" aria-hidden="true">🗺️ Как добраться</div>
          <div class="map-section">
            <div class="map-container">
              <div class="map-grid" aria-hidden="true"></div>
              <div class="map-pin" aria-hidden="true">📍</div>
              <div class="map-overlay">
                <div class="map-address" id="map-address">Al Qudra Sports Complex, Dubai</div>
                <button class="map-btn" data-action="open-yandex" aria-label="Построить маршрут в Яндекс Картах">
                  <span aria-hidden="true">🗺️</span> Маршрут
                </button>
              </div>
            </div>
          </div>
          <button class="map-yandex-btn" data-action="open-yandex" aria-label="Открыть в Яндекс Картах">
            <span aria-hidden="true">🗺️</span> Открыть в Яндекс Картах
          </button>
          <div style="padding:0 20px; margin-top:8px;">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span class="tag" aria-label="15 минут от центра">🚗 15 мин от центра</span>
              <span class="tag tag-green" aria-label="Есть парковка">🅿️ Парковка</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Идут из твоих друзей</div>
          <div class="detail-friends-row" id="detail-friends" role="list" aria-label="Друзья, идущие на активность"></div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Организатор</div>
          <div style="display:flex; align-items:center; gap:12px; padding:14px; background:var(--tg-surface); border-radius:16px; border:1px solid var(--tg-border);">
            <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, var(--tg-blue), var(--tg-purple)); display:flex; align-items:center; justify-content:center; font-size:24px;" aria-hidden="true">🏟️</div>
            <div>
              <div style="font-weight:600;">Dubai Football Community</div>
              <div style="font-size:13px; color:var(--tg-text-secondary);">⭐ 4.9 • 45 мероприятий</div>
            </div>
          </div>
        </div>
        <div style="height:100px;"></div>
      </div>
      <div class="detail-footer">
        <div>
          <div class="detail-price" id="detail-price">25 USDT</div>
          <div class="detail-price-crypto" id="detail-fiat">≈ 2 250 ₽</div>
        </div>
        <button class="btn btn-primary" style="width:auto; padding:14px 32px;" data-action="open-payment" aria-label="Забронировать активность">
          Забронировать
        </button>
      </div>
    </div>
  `,

  friends: `
    <div id="friends-screen" class="screen" role="main" aria-label="Друзья">
      <div class="screen-header">
        <div class="header-title" aria-hidden="true">👥 Друзья</div>
        <div class="header-subtitle">Чем занимаются твои контакты</div>
      </div>
      <div class="section">
        <div class="section-title">Сейчас онлайн</div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div style="position:relative;">
            <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">🧑‍💻</div>
            <div style="position:absolute; bottom:0; right:0; width:14px; height:14px; background:var(--tg-green); border-radius:50%; border:2px solid var(--tg-bg);" aria-hidden="true"></div>
          </div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Иван Петров</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Играет в CS2 турнир</div>
            <div style="font-size:12px; color:var(--tg-blue-light); margin-top:4px;" aria-hidden="true">🎮 12 участников • Награда: 50 USDT</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="cs2" aria-label="Войти в CS2 турнир">Войти</button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Ближайшие планы</div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">👩‍🦰</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Мария Козлова</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Йога в парке Гези</div>
            <div style="font-size:12px; color:var(--tg-orange); margin-top:4px;" aria-hidden="true">🕖 Завтра 8:00</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="yoga" aria-label="Присоединиться к йоге">+ Я</button>
        </div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">🧔</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Дмитрий Волков</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Футбол Al Qudra</div>
            <div style="font-size:12px; color:var(--tg-green); margin-top:4px;" aria-hidden="true">📅 Четверг 19:00</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="football" aria-label="Присоединиться к футболу">+ Я</button>
        </div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">👱‍♀️</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Анна Смирнова</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Винная дегустация</div>
            <div style="font-size:12px; color:var(--tg-purple); margin-top:4px;" aria-hidden="true">🍷 Суббота 18:00</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="wine" aria-label="Присоединиться к дегустации">+ Я</button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Пригласить друзей</div>
        <div style="padding:20px; background:linear-gradient(135deg, rgba(0,136,204,0.1), rgba(175,82,222,0.1)); border:1px solid var(--tg-border); border-radius:20px; text-align:center;">
          <div style="font-size:40px; margin-bottom:10px;" aria-hidden="true">🎁</div>
          <div style="font-weight:700; font-size:16px; margin-bottom:6px;">Пригласи друга — получи 50 $CHILI</div>
          <div style="font-size:14px; color:var(--tg-text-secondary); margin-bottom:16px;">За каждого друга, который забронирует активность</div>
          <button class="btn btn-primary" data-action="share-link" aria-label="Поделиться ссылкой с другом">
            📤 Поделиться ссылкой
          </button>
        </div>
      </div>
    </div>
  `,

  profile: `
    <div id="profile-screen" class="screen" role="main" aria-label="Профиль">
      <div class="profile-header">
        <div class="profile-avatar-large" aria-hidden="true">🧑‍💼</div>
        <div class="profile-name">Савва Крипто</div>
        <div class="profile-handle">@savva_chili</div>
        <div class="profile-stats" role="list" aria-label="Статистика профиля">
          <div class="stat" role="listitem">
            <div class="stat-value">24</div>
            <div class="stat-label">Бронирования</div>
          </div>
          <div class="stat" role="listitem">
            <div class="stat-value">12</div>
            <div class="stat-label">Друзей</div>
          </div>
          <div class="stat" role="listitem">
            <div class="stat-value">8</div>
            <div class="stat-label">NFT Бейджей</div>
          </div>
        </div>
      </div>
      <div class="streak-banner">
        <div class="streak-icon" aria-hidden="true">🔥</div>
        <div class="streak-text">
          <div class="streak-title">Streak: 12 дней!</div>
          <div class="streak-subtitle">Ты на 3-м месте среди друзей. До 15 дней — бейдж «Огненный».</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">🏆 NFT Бейджи</div>
        <div class="nft-grid" role="list" aria-label="NFT бейджи">
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">⚽</div>
            <div>Футболист</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🧘</div>
            <div>Йог</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🎮</div>
            <div>Геймер</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🍷</div>
            <div>Сомелье</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🎓</div>
            <div>Студент</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🎯</div>
            <div>Квестер</div>
          </div>
          <div class="nft-badge" role="listitem">
            <div class="nft-icon" style="opacity:0.3;" aria-hidden="true">🔥</div>
            <div style="opacity:0.5;">Огненный</div>
          </div>
          <div class="nft-badge" role="listitem">
            <div class="nft-icon" style="opacity:0.3;" aria-hidden="true">💎</div>
            <div style="opacity:0.5;">VIP</div>
          </div>
          <div class="nft-badge" role="listitem">
            <div class="nft-icon" style="opacity:0.3;" aria-hidden="true">👑</div>
            <div style="opacity:0.5;">Король</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">📅 Мои бронирования</div>
        <div class="booking-item" role="listitem">
          <div class="booking-icon" aria-hidden="true">⚽</div>
          <div class="booking-info">
            <div class="booking-title">Футбол с друзьями</div>
            <div class="booking-meta">📍 Al Qudra • чт 19:00</div>
            <span class="booking-status status-confirmed">✅ Подтверждено</span>
          </div>
        </div>
        <div class="booking-item" role="listitem">
          <div class="booking-icon" aria-hidden="true">🧘‍♀️</div>
          <div class="booking-info">
            <div class="booking-title">Утренняя йога</div>
            <div class="booking-meta">📍 Парк Гези • пт 8:00</div>
            <span class="booking-status status-upcoming">⏳ Ожидается</span>
          </div>
        </div>
        <div class="booking-item" role="listitem">
          <div class="booking-icon" aria-hidden="true">🗝️</div>
          <div class="booking-info">
            <div class="booking-title">Квест «Алькатрас»</div>
            <div class="booking-meta">📍 Тверская • сб 16:00</div>
            <span class="booking-status status-upcoming">⏳ Ожидается</span>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">⚙️ Настройки</div>
        <div style="background:var(--tg-surface); border-radius:16px; border:1px solid var(--tg-border); overflow:hidden;" role="list">
          <div style="padding:16px 20px; border-bottom:1px solid var(--tg-border); display:flex; justify-content:space-between; align-items:center;" role="listitem">
            <span>🔔 Уведомления</span>
            <span style="color:var(--tg-green); font-weight:600;">Вкл</span>
          </div>
          <div style="padding:16px 20px; border-bottom:1px solid var(--tg-border); display:flex; justify-content:space-between; align-items:center;" role="listitem">
            <span>🌙 Тёмная тема</span>
            <span style="color:var(--tg-green); font-weight:600;">Вкл</span>
          </div>
          <div style="padding:16px 20px; border-bottom:1px solid var(--tg-border); display:flex; justify-content:space-between; align-items:center;" role="listitem">
            <span>💰 Валюта отображения</span>
            <span style="color:var(--tg-text-secondary);">USDT / ₽</span>
          </div>
          <button style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; color:var(--tg-red); width:100%; background:none; border:none; cursor:pointer; font-size:inherit;" data-action="logout" role="listitem" aria-label="Выйти из аккаунта">
            <span>🚪 Выйти</span>
          </button>
        </div>
      </div>
    </div>
  `,

  payment: `
    <div id="payment-screen" class="screen" role="main" aria-label="Оплата">
      <div class="screen-header">
        <button class="detail-back" data-action="go-back" aria-label="Назад" style="position:relative; top:0; left:0; display:inline-flex; margin-bottom:10px;">←</button>
        <div class="header-title" aria-hidden="true">💳 Оплата</div>
        <div class="header-subtitle">Выбери способ оплаты</div>
      </div>
      <div class="payment-options" role="radiogroup" aria-label="Способы оплаты">
        <div class="payment-option selected" data-action="select-payment" data-type="usdt" role="radio" aria-checked="true" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #26a17b, #2ecc71);" aria-hidden="true">💵</div>
          <div class="payment-info">
            <div class="payment-name">USDT (TRC-20)</div>
            <div class="payment-balance">Баланс: 450 USDT</div>
          </div>
          <div class="payment-check" aria-hidden="true">✓</div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="ton" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #0088cc, #2aabee);" aria-hidden="true">💎</div>
          <div class="payment-info">
            <div class="payment-name">TON</div>
            <div class="payment-balance">Баланс: 120 TON</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="chili" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #af52de, #ff2d55);" aria-hidden="true">❄️</div>
          <div class="payment-info">
            <div class="payment-name">$CHILI (токен)</div>
            <div class="payment-balance">Баланс: 1,240 $CHILI</div>
            <div style="font-size:12px; color:var(--tg-green); margin-top:2px;">💰 Cashback 10%</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div style="margin: 8px 0 12px; padding-left: 8px; font-size: 13px; color: var(--tg-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;" aria-hidden="true">
          💳 Фиатные деньги
        </div>
        <div class="payment-option" data-action="select-payment" data-type="card_rub" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #fc3f1d, #ff6b4d);" aria-hidden="true">💳</div>
          <div class="payment-info">
            <div class="payment-name">Банковская карта <span class="fiat-badge">RUB</span></div>
            <div class="payment-balance">Visa / Mastercard / МИР</div>
            <div style="font-size:12px; color:var(--tg-text-secondary); margin-top:2px;">Конвертация по курсу ЦБ</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="card_usd" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #1e3a8a, #3b82f6);" aria-hidden="true">💳</div>
          <div class="payment-info">
            <div class="payment-name">Банковская карта <span class="fiat-badge" style="background:rgba(59,130,246,0.15); color:#60a5fa;">USD</span></div>
            <div class="payment-balance">Visa / Mastercard</div>
            <div style="font-size:12px; color:var(--tg-text-secondary); margin-top:2px;">Для международных карт</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="sbp" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #7c3aed, #a78bfa);" aria-hidden="true">📲</div>
          <div class="payment-info">
            <div class="payment-name">Система быстрых платежей</div>
            <div class="payment-balance">СБП по номеру телефона</div>
            <div style="font-size:12px; color:var(--tg-green); margin-top:2px;">⚡ Мгновенно • Без комиссии</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
      </div>
      <div class="summary-box">
        <div class="summary-row">
          <span style="color:var(--tg-text-secondary);">Активность</span>
          <span id="pay-activity">Футбол с друзьями</span>
        </div>
        <div class="summary-row">
          <span style="color:var(--tg-text-secondary);">Стоимость</span>
          <span id="pay-price">25 USDT</span>
        </div>
        <div class="summary-row" id="pay-conversion-row" style="display:none;">
          <span style="color:var(--tg-text-secondary);">Конвертация</span>
          <span id="pay-conversion" style="color:var(--tg-orange);"></span>
        </div>
        <div class="summary-row">
          <span style="color:var(--tg-text-secondary);">Комиссия</span>
          <span id="pay-fee" style="color:var(--tg-green);">~0.1 USDT</span>
        </div>
        <div class="summary-row total">
          <span>Итого</span>
          <span id="pay-total" style="color:var(--tg-blue-light);">25.1 USDT</span>
        </div>
      </div>
      <div style="padding:0 20px 20px;">
        <button class="btn btn-primary" data-action="process-payment" aria-label="Подтвердить и оплатить">
          <span aria-hidden="true">🔒</span> Подтвердить и оплатить
        </button>
        <div style="text-align:center; margin-top:12px; font-size:12px; color:var(--tg-text-secondary);">
          <span id="pay-security">🔒 Транзакция защищена смарт-контрактом TON</span>
        </div>
      </div>
    </div>
  `,

  success: `
    <div id="success-screen" class="screen" role="main" aria-label="Успешное бронирование">
      <div class="success-circle" aria-hidden="true">✓</div>
      <h2 class="success-title">Бронирование подтверждено!</h2>
      <p class="success-subtitle">
        Твой NFT-билет создан на блокчейне TON.<br>
        Покажи QR-код на входе.
      </p>
      <div class="nft-ticket">
        <div class="ticket-header">
          <span class="ticket-label">NFT Билет</span>
          <span class="ticket-chain" aria-hidden="true">⛓️ TON</span>
        </div>
        <div class="ticket-title" id="ticket-title">Футбол с друзьями</div>
        <div class="ticket-meta">
          📍 Al Qudra, Dubai<br>
          🕖 Четверг, 19:00<br>
          💎 Оплачено: <span id="ticket-payment">25 USDT</span>
        </div>
        <div class="ticket-qr" aria-label="QR-код билета">
          <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
            <rect x="10" y="10" width="30" height="30" fill="black"/>
            <rect x="60" y="10" width="30" height="30" fill="black"/>
            <rect x="10" y="60" width="30" height="30" fill="black"/>
            <rect x="45" y="45" width="10" height="10" fill="black"/>
            <rect x="60" y="60" width="10" height="10" fill="black"/>
            <rect x="80" y="60" width="10" height="10" fill="black"/>
            <rect x="60" y="80" width="30" height="10" fill="black"/>
          </svg>
        </div>
      </div>
      <button class="btn btn-primary" data-action="navigate" data-screen="home" aria-label="На главную">
        🏠 На главную
      </button>
      <button class="btn btn-secondary" data-action="share-invite" aria-label="Пригласить друга">
        📤 Пригласить друга
      </button>
      <button class="btn btn-yandex" data-action="open-yandex" style="margin-top:12px;" aria-label="Построить маршрут">
        <span aria-hidden="true">🗺️</span> Построить маршрут
      </button>
    </div>
  `
};

// ===== RENDER APP =====
export function renderApp() {
  const appFrame = UI.el('app-frame');

  // Loading overlay
  appFrame.appendChild(UI.create('div', {
    id: 'loading-overlay',
    class: 'loading-overlay',
    role: 'status',
    'aria-live': 'polite'
  }, [
    UI.create('div', { class: 'spinner', 'aria-hidden': 'true' }),
    UI.create('span', { id: 'loading-text', style: 'color:var(--tg-text-secondary); font-size:14px;' }, ['Загрузка...'])
  ]));

  // Wallet connect button
  appFrame.appendChild(UI.create('button', {
    id: 'wallet-btn',
    class: 'wallet-connect-btn',
    'aria-label': 'Подключить кошелек TON'
  }, ['💎 Подключить']));

  // Screens
  Object.values(templates).forEach(html => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    appFrame.appendChild(wrapper.firstElementChild);
  });

  // Bottom nav
  appFrame.appendChild(UI.create('nav', {
    id: 'bottom-nav',
    class: 'bottom-nav',
    style: 'display:none;',
    role: 'navigation',
    'aria-label': 'Главная навигация'
  }, [
    UI.create('button', {
      class: 'nav-item active',
      'data-action': 'navigate',
      'data-screen': 'home',
      'data-index': '0',
      'aria-label': 'Главная',
      'aria-current': 'page'
    }, [
      UI.create('span', { class: 'nav-icon', 'aria-hidden': 'true' }, ['🏠']),
      UI.create('span', { class: 'nav-label' }, ['Главная'])
    ]),
    UI.create('button', {
      class: 'nav-item',
      'data-action': 'navigate',
      'data-screen': 'friends',
      'data-index': '1',
      'aria-label': 'Друзья'
    }, [
      UI.create('span', { class: 'nav-icon', 'aria-hidden': 'true' }, ['👥']),
      UI.create('span', { class: 'nav-label' }, ['Друзья'])
    ]),
    UI.create('button', {
      class: 'nav-item',
      'data-action': 'navigate',
      'data-screen': 'profile',
      'data-index': '2',
      'aria-label': 'Профиль'
    }, [
      UI.create('span', { class: 'nav-icon', 'aria-hidden': 'true' }, ['👤']),
      UI.create('span', { class: 'nav-label' }, ['Профиль'])
    ])
  ]));

  // Toast
  appFrame.appendChild(UI.create('div', {
    id: 'toast',
    class: 'toast',
    role: 'status',
    'aria-live': 'polite'
  }));
}

// ===== EVENT HANDLERS =====
export function setupEventHandlers() {
  const appFrame = UI.el('app-frame');

  appFrame.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    telegram.haptic('light');
    handleAction(action, actionEl.dataset);
  });

  appFrame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        e.preventDefault();
        handleAction(actionEl.dataset.action, actionEl.dataset);
      }
    }
  });
}

function handleAction(action, data) {
  switch (action) {
    case 'auth-telegram':
      authWithTelegram();
      break;
    case 'navigate':
      showScreen(data.screen);
      router.navigate(data.screen);
      break;
    case 'open-activity':
      openActivity(data.id);
      router.navigate('detail/' + data.id);
      break;
    case 'go-back':
      goBack();
      break;
    // НОВОЕ: Действия для Избранного и фильтров
    case 'add-fav':
      toggleFavorite(data.id, true);
      break;
    case 'remove-fav':
      toggleFavorite(data.id, false);
      break;
    case 'clear-filter':
      store.set('activeFilter', null);
      renderActivities(); // Перерисовываем без фильтра
      break;
    case 'open-yandex':
      openInYandexMaps();
      break;
    case 'filter-category':
      store.set('activeFilter', data.cat);
      renderActivities(); // Перерисовываем с фильтром категории
      telegram.haptic('light');
      break;
    case 'share-link':
      shareLink();
      break;
    case 'share-invite':
      shareInvite();
      break;
    case 'logout':
      logout();
      break;
    // Платежи пока оставляем, они не ломают приложение, но Шаг 3 мы их вырежем
    case 'open-payment':
      openPayment();
      router.navigate('payment');
      break;
    case 'select-payment':
      selectPayment(data.type);
      break;
    case 'process-payment':
      processPayment();
      break;
  }
}
