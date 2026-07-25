export class TelegramAdapter {
  constructor() {
    this.tg = window.Telegram?.WebApp;
    this.ready = false;
  }

  init() {
    if (!this.tg) {
      console.warn('Telegram WebApp not available');
      return;
    }
    this.tg.ready();
    this.tg.expand();
    this.applyTheme();
    this.setupViewport();
    this.ready = true;

    // Log initData for debugging (remove in production)
    console.log('Telegram initData:', this.tg.initData);
    console.log('Telegram user:', this.tg.initDataUnsafe?.user);
  }

  getInitData() {
    return this.tg?.initData || '';
  }

  getUser() {
    return this.tg?.initDataUnsafe?.user || null;
  }

  applyTheme() {
    if (!this.tg) return;
    const theme = this.tg.themeParams;
    const root = document.documentElement;
    if (theme.bg_color) root.style.setProperty('--tg-theme-bg-color', theme.bg_color);
    if (theme.text_color) root.style.setProperty('--tg-theme-text-color', theme.text_color);
    if (theme.hint_color) root.style.setProperty('--tg-theme-hint-color', theme.hint_color);
    if (theme.button_color) root.style.setProperty('--tg-theme-button-color', theme.button_color);
    if (theme.button_text_color) root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
    if (theme.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color);
  }

  setupViewport() {
    if (!this.tg) return;
    this.tg.onEvent('viewportChanged', () => {
      document.documentElement.style.setProperty('--safe-area-top', this.tg.viewportStableHeight + 'px');
    });
    if (this.tg.isExpanded) {
      this.tg.requestFullscreen?.();
    }
  }

  haptic(type = 'light') {
    if (this.tg?.HapticFeedback) {
      this.tg.HapticFeedback.impactOccurred(type);
    }
  }

  setHeaderColor(color) {
    if (this.tg) this.tg.setHeaderColor(color);
  }

  showBackButton(visible) {
    if (this.tg?.BackButton) {
      visible ? this.tg.BackButton.show() : this.tg.BackButton.hide();
    }
  }

  setMainButton(text, visible, onClick) {
    if (!this.tg?.MainButton) return;
    this.tg.MainButton.setText(text);
    visible ? this.tg.MainButton.show() : this.tg.MainButton.hide();
    this.tg.MainButton.onClick(onClick);
  }

  share(url, text) {
    if (this.tg) {
      this.tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    }
  }

  close() {
    if (this.tg) this.tg.close();
  }
}

export const telegram = new TelegramAdapter();
