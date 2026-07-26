export class TONConnectAdapter {
  constructor() {
    this.connector = null;
    this.connected = false;
    this.address = null;
  }

  async init() {
    if (typeof TonConnectUI === 'undefined') {
      console.warn('TON Connect UI not loaded');
      return;
    }
    this.connector = new TonConnectUI({
      // ИСПРАВЛЕНО: Убрана заглушка your-domain.com, вставлен реальный URL Cloudflare
      manifestUrl: 'https://chili-app.pages.dev/tonconnect-manifest.json'
    });
    this.connector.onStatusChange(wallet => {
      this.connected = !!wallet;
      this.address = wallet?.account?.address || null;
      this.updateUI();
    });
  }

  updateUI() {
    const btn = document.getElementById('wallet-btn');
    if (!btn) return;
    if (this.connected && this.address) {
      btn.textContent = '💎 ' + this.address.slice(0, 6) + '...' + this.address.slice(-4);
      btn.classList.add('connected');
      btn.setAttribute('aria-label', 'Кошелек подключен: ' + this.address);
    } else {
      btn.textContent = '💎 Подключить';
      btn.classList.remove('connected');
      btn.setAttribute('aria-label', 'Подключить кошелек TON');
    }
    btn.style.display = 'block';
  }

  async connect() {
    if (!this.connector) {
      window.showToast?.('❌ TON Connect недоступен');
      return;
    }
    try {
      await this.connector.connectWallet();
    } catch (e) {
      console.error('TON Connect error:', e);
      window.showToast?.('❌ Ошибка подключения кошелька');
    }
  }

  async sendTransaction(to, amount, payload) {
    if (!this.connector || !this.connected) {
      window.showToast?.('❌ Сначала подключите кошелек');
      return null;
    }
    try {
      const result = await this.connector.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [{
          address: to,
          amount: String(amount),
          payload: payload || ''
        }]
      });
      return result;
    } catch (e) {
      console.error('Transaction error:', e);
      window.showToast?.('❌ Транзакция отменена или не удалась');
      return null;
    }
  }
}

export const tonConnect = new TONConnectAdapter();
