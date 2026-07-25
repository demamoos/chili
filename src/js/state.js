export class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Set();
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(key, value) {
    this.listeners.forEach(fn => fn(key, value));
  }
}

export const store = new StateManager({
  currentScreen: 'auth',
  selectedActivity: null,
  selectedPayment: 'usdt',
  user: null,
  wallet: null,
  history: []
});
