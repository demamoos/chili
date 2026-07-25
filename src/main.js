import './styles/main.css';
import { renderApp, setupEventHandlers } from './js/app.js';
import { telegram } from './js/telegram.js';
import { tonConnect } from './js/tonconnect.js';
import { router } from './js/router.js';
import { showScreen, setNavActive, goBack, openActivity, openPayment } from './js/screens.js';

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.error('SW registration failed:', err));
}

// ===== ROUTES =====
router.on('auth', () => showScreen('auth'));
router.on('home', () => { showScreen('home'); setNavActive(0); });
router.on('friends', () => { showScreen('friends'); setNavActive(1); });
router.on('profile', () => { showScreen('profile'); setNavActive(2); });
router.on('detail', (id) => openActivity(id));
router.on('payment', () => openPayment());
router.on('success', () => showScreen('success'));

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  setupEventHandlers();
  telegram.init();
  tonConnect.init();

  // Wallet button
  document.getElementById('wallet-btn').addEventListener('click', () => tonConnect.connect());

  // Telegram BackButton
  if (telegram.tg?.BackButton) {
    telegram.tg.BackButton.onClick(() => goBack());
  }

  // Initial screen
  if (window.location.hash) {
    router.resolve();
  } else {
    showScreen('auth');
  }
});
