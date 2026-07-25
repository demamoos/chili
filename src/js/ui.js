export const UI = {
  el(id) {
    return document.getElementById(id);
  },

  create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
    return el;
  },

  clear(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  },

  show(el) {
    el.style.display = '';
  },

  hide(el) {
    el.style.display = 'none';
  }
};
