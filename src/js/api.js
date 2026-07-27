export class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  // ИСПРАВЛЕНО: Переписан метод request для максимальной надежности.
  // Мы явно конструируем fetchOptions, чтобы исключить баги, 
  // когда браузер может случайно сменить POST на GET.
  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    
    const fetchOptions = {
      method: options.method || 'GET', // Если метод не передан, дефолт GET. Но auth передает POST!
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}) // 安全地合并 headers
      }
    };

    // Добавляем body ТОЛЬКО если он передан (для POST запросов)
    if (options.body) {
      fetchOptions.body = options.body;
    }

    // Добавляем токен авторизации, если есть
    if (this.token) {
      fetchOptions.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // ИСПРАВЛЕНО: Теперь мы пытаемся прочитать JSON. Если бэкенд вернул текст, не крашимся.
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error('API Error:', e);
      throw e;
    }
  }

  // ИСПРАВЛЕНО: Метод auth теперь принимает объект payload 
  // и ЖЕСТКО задает method: 'POST'
  async auth(payload) {
    const result = await this.request('/api/auth', {
      method: 'POST', // <-- КРИТИЧЕСКИ ВАЖНО!
      body: JSON.stringify(payload) 
    });
    this.setToken(result.token);
    return result;
  }

  // Get activities from backend
  async getActivities() {
    return this.request('/api/activities');
  }

  // Get single activity
  async getActivity(id) {
    return this.request(`/api/activities/${id}`);
  }

  // Create booking
  async createBooking(activityId, paymentType) {
    return this.request('/api/booking', {
      method: 'POST',
      body: JSON.stringify({ activityId, paymentType })
    });
  }
}

// Use relative URL for Cloudflare Pages Functions
export const api = new APIClient('');