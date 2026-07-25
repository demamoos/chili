export class Router {
  constructor() {
    this.routes = {};
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('popstate', () => this.resolve());
  }

  on(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path, push = true) {
    if (push) window.history.pushState(null, '', '#' + path);
    else window.location.hash = path;
    this.resolve();
  }

  resolve() {
    const hash = window.location.hash.slice(1) || 'auth';
    const [screen, id] = hash.split('/');
    if (this.routes[screen]) this.routes[screen](id);
  }

  back() {
    window.history.back();
  }
}

export const router = new Router();
