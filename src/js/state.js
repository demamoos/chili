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

// ИСПРАВЛЕНО: Добавлены поля для авторизации, локации и настроек юзера
export const store = new StateManager({
  currentScreen: 'auth', // Начинаем с авторизации
  isAuthenticated: false, // Флаг реальной авторизации
  acceptedTerms: false,   // Согласие с правилами
  userLocation: null,     // Координаты { lat, lng }
  selectedActivity: null,
  selectedPayment: 'free_nft', // Платежи убраны, тип по умолчанию бесплатный
  user: null,
  wallet: null,
  history: [],
  // НОВЫЕ ПОЛЯ:
  activities: [],       // Массив всех активностей, полученный с /api/activities
  categories: [],       // Массив уникальных категорий (Еда, Спорт...) для фильтра
  favorites: JSON.parse(localStorage.getItem('chili_favorites') || '[]'), // Массив ID избранных
  activeFilter: null    // Текущий выбранный фильтр категории (null = все)
});
