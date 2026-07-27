export class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error('API Error:', e);
      throw e;
    }
  }

  // ИСПРАВЛЕНО: Метод auth обновлен. 
  // Теперь он принимает объект payload (initData + location + terms), 
  // а не просто строку initData. 
  // Явно указываем method: 'POST' чтобы избежать 405 ошибки!
  async auth(payload) {
    const result = await this.request('/api/auth', {
      method: 'POST', // <-- КРИТИЧЕСКИ ВАЖНО! Без этого может уйти как GET
      body: JSON.stringify(payload) // Сериализуем весь объект { initData, location, acceptedTerms }
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
