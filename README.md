# Chili 🌶️

Telegram Mini App для агрегации досуговых активностей с оплатой криптовалютой (USDT, TON, $CHILI) и фиатом (RUB/USD).

## Стек

- **Vite** — сборка
- **Vanilla JS (ES Modules)** — логика
- **@telegram-apps/sdk** — интеграция с Telegram
- **@tonconnect/ui** — подключение TON кошелька
- **Cloudflare Pages** — хостинг + CDN
- **GitLab CI/CD** — автодеплой

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Локальная разработка
npm run dev

# Сборка для production
npm run build

# Preview (как на Cloudflare)
npm run preview
```

## Деплой на Cloudflare Pages

### 1. Настройка Cloudflare

1. Зайди в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Pages** → **Create a project**
3. Подключи GitLab репозиторий
4. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### 2. Переменные окружения в GitLab

В **Settings → CI/CD → Variables** добавь:

| Variable | Description | Masked |
|---|---|---|
| `CF_ACCOUNT_ID` | Cloudflare Account ID | ✅ |
| `CF_API_TOKEN` | Cloudflare API Token (Edit Cloudflare Pages) | ✅ |

**Как получить API Token:**
1. Cloudflare Dashboard → **My Profile** → **API Tokens**
2. **Create Token** → **Custom token**
3. Permissions: `Cloudflare Pages:Edit`
4. Account Resources: Include your account

### 3. Первый деплой

```bash
git push origin main
```

GitLab CI автоматически:
1. Запустит линтер
2. Соберёт проект
3. Задеплоит на `https://chili-app.pages.dev`

### 4. Настройка кастомного домена (опционально)

1. Cloudflare Pages → **Custom domains**
2. Добавь свой домен (например, `app.chili.io`)
3. Cloudflare автоматически выдаст SSL

## Структура проекта

```
chili-project/
├── src/
│   ├── main.js              # Точка входа
│   ├── styles/
│   │   └── main.css         # Стили
│   ├── js/
│   │   ├── state.js         # StateManager
│   │   ├── router.js        # Hash-based Router
│   │   ├── telegram.js      # Telegram WebApp Adapter
│   │   ├── tonconnect.js    # TON Connect Adapter
│   │   ├── api.js           # API Client
│   │   ├── ui.js            # UI Renderer
│   │   ├── screens.js       # Screen Manager
│   │   ├── data.js          # Mock data
│   │   └── app.js           # Templates + Events
├── index.html               # HTML точка входа
├── tonconnect-manifest.json # Манифест TON Connect
├── vite.config.js           # Vite конфиг
├── wrangler.toml            # Cloudflare Workers/Pages config
├── .gitlab-ci.yml           # CI/CD pipeline
├── package.json
└── README.md
```

## Настройка Telegram Mini App

### 1. Создать бота в @BotFather

```
/newbot
→ Chili
→ chili_app_bot
```

Сохрани **BOT_TOKEN**.

### 2. Создать Mini App

```
/mybots → chili_app_bot → Bot Settings → Menu Button → Configure menu button
```

Или:
```
/newapp
```

Укажи:
- **URL**: `https://chili-app.pages.dev` (или свой домен)
- **Название**: Chili
- **Описание**: Досуг с друзьями, оплата криптой
- **Иконка**: 512×512 PNG

### 3. Точка входа для пользователей

```
https://t.me/chili_app_bot/app
```

## Перед production

1. ✅ Обнови `tonconnect-manifest.json` — замени URL на свой домен
2. ✅ Замени mock-методы в `src/js/api.js` на реальные endpoint'ы
3. ✅ Замени `EQD...` в `src/js/screens.js` на адрес смарт-контракта
4. ✅ Добавь backend для валидации `initData` от Telegram
5. ✅ Настрой аналитику (gtag / amplitude)
6. ✅ Протестируй на iOS Safari и Android Chrome

## Лицензия

MIT
