import './styles/main.css';
import { renderApp, setupEventHandlers } from './js/app.js';
import { telegram } from './js/telegram.js';
import { tonConnect } from './js/tonconnect.js';
import { router } from './js/router.js';
import { showScreen, setNavActive, goBack, openActivity, checkAutoAuth } from './js/screens.js'; // ДОБАВЛЕНО: checkAutoAuth

// ===== ROUTES =====
router.on('auth', () => showScreen('auth'));
router.on('home', () => { showScreen('home'); setNavActive(0); });
router.on('friends', () => { showScreen('friends'); setNavActive(1); });
router.on('profile', () => { showScreen('profile'); setNavActive(2); });
router.on('detail', (id) => openActivity(id));
// router.on('payment') -> УБРАНО! Платежей нет
router.on('success', () => showScreen('success'));

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  setupEventHandlers();
  telegram.init();
  tonConnect.init();

  document.getElementById('wallet-btn').addEventListener('click', () => tonConnect.connect());

  if (telegram.tg?.BackButton) {
    telegram.tg.BackButton.onClick(() => goBack());
  }

  // ИСПРАВЛЕНО: Проверяем, авторизован ли юзер уже (авто-вход)
  // Если да, checkAutoAuth сразу перекинет на Home
  if (!checkAutoAuth()) {
    // Если не авторизован, слушаем кнопку входа
    router.resolve();
  }
});