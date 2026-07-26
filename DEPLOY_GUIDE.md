# 🚀 Деплой Chili на Cloudflare Pages + Telegram Mini App (GitHub Edition)
## Важное замечание по структуре проекта
Для успешного деплоя на Cloudflare Pages проект должен иметь следующую структуру:
* /src/ — исходный код Frontend (Vite собирает его в папку /dist/)
* /public/ — статичные файлы (manifest, sw.js, _headers). Vite автоматически копирует их в /dist/
* /functions/ — Backend API (Cloudflare автоматически превращает папку /functions в серверный бэкенд)
* НЕ НУЖНЫ: wrangler.toml (мешает автодеплою) и _redirects (вызывает бесконечный цикл, CF Pages сам понимает SPA).
## Шаг 1: Cloudflare Setup
### 1.1 Создать аккаунт
Зайди на dash.cloudflare.com → Sign up.
### 1.2 Подключить GitHub к Cloudflare Pages
В левом меню Cloudflare нажми Workers & Pages.
Нажми Create application → вкладка Pages → Connect to Git.
Авторизуй GitHub и выбери репозиторий chili-project.
### 1.3 Настройки сборки (Build settings)
Project name: chili-app (это определит ваш URL: chili-app.pages.dev)
Production branch: main
Framework preset: None (Важно! Если выбрать Vite, CF может потребовать версию 6.0.0+ и сломать сборку. None — самый надежный путь).
Build command: npm run build
Build output directory: dist
В разделе Environment variables нажми Add variable:
NODE_VERSION = 20 (Критически важно! Без этого Vite 5/6 падает на старых версиях Node).
Нажми Save and Deploy.
## Шаг 2: Добавить BOT_TOKEN (Обязательно!)
Без этого ваш бэкенд /api/auth не сможет валидировать Telegram initData и будет падать.

Cloudflare Dashboard → Pages → chili-app → вкладка Settings.
Раздел Environment variables → Add variable:
Variable name: BOT_TOKEN
Value: (Вставь сюда токен от @BotFather, например 123456789:ABCdef...)
Выбери Encrypt и нажми Save.
Важно: Перейди на вкладку Deployments, выбери последний деплой и нажми Retry deployment, чтобы токен применился.
## Шаг 3: Telegram Mini App Setup
### 3.1 Создать бота
Открой @BotFather в Telegram → отправь /newbot.
Имя: Chili, Username: chili_app_bot (придумай свой).
Сохрани BOT_TOKEN.
### 3.2 Создать Mini App
В @BotFather:

/newapp
→ Выбери chili_app_bot
→ Название: Chili
→ Описание: Досуг с друзьями, оплата криптой
→ URL: https://chili-app.pages.dev ← твой Cloudflare URL
→ Загрузи иконку 512×512 PNG


## ⚠️ Шаг 4: Ошибки при деплое и их решения (ТРОПА БОЛИ)

Если ваш деплой выдает ошибку, найдите её ниже и примените фикс.

### Ошибка 1: `Failed: error occurred while running deploy command`
**Причина:** Cloudflare использует старую версию Node.js (16 или 18), а Vite 5/6 требует Node 18+.
**Решение:** Добавить переменную `NODE_VERSION = 20` в Environment variables в настройках сборки Cloudflare (см. Шаг 1.3).

### Ошибка 2: `Missing entry-point to Worker script or to assets directory`
**Причина:** В корне проекта лежит файл `wrangler.toml`. При автодеплое через Dashboard Cloudflare думает, что это чистый Worker, а не Pages-проект, и ищет точку входа в скрипт.
**Решение:** Удалить `wrangler.toml` из репозитория. Cloudflare Dashboard автоматически найдет папку `/functions` для бэкенда без этого файла.
```bash
rm wrangler.toml
git push origin main
Ошибка 3: The version of Vite used in the project ("5.x") cannot be automatically configured. Please update the Vite version to at least "6.0.0"
Причина: Cloudflare жестко проверяет версию Vite, если в Framework preset выбрано Vite.
Решение (Самое простое): Зайди в Settings -> Builds & deployments -> измени Framework preset на None. Cloudflare перестанет проверять версию и просто запустит вашу команду сборки.
Решение (Если хотите Vite 6): Обновите Vite локально npm install vite@latest --save-dev, но будьте готовы к Ошибкам 4 и 5.

Ошибка 4 (Если обновились до Vite 6): TypeError: manualChunks is not a function
Причина: Vite 6 сменил движок сборки на Rolldown. Он не понимает manualChunks в виде объекта (как было в Vite 5), требует функцию.
Решение: В vite.config.js перепишите блок rollupOptions.output:

javascript

// Удалите это:
// manualChunks: { vendor: ['@telegram-apps/sdk', '@tonconnect/ui'] }

// Добавьте это (или просто удалите manualChunks полностью):
manualChunks(id) {
  if (id.includes('@telegram-apps/sdk') || id.includes('@tonconnect/ui')) {
    return 'vendor';
  }
}
Ошибка 5 (Если обновились до Vite 6): Cannot modify Vite config: could not find a valid plugins array
Причина: Cloudflare пытается внедрить свои плагины в ваш vite.config.js, но если там нет массива plugins, скрипт падает.
Решение: Добавьте пустой массив плагинов в vite.config.js:

javascript

export default defineConfig({
  plugins: [], // ✅ Обязательно добавьте эту строку!
  base: '/',
  // ... остальной код
});
Ошибка 6: Invalid _redirects configuration: Infinite loop detected
Причина: Файл public/_redirects содержит правило /* /index.html 200. Новый строгий парсер Cloudflare считает это бесконечным циклом (запрос /index.html попадает под правило /* и пытается редиректить на себя).
Решение: Удалить файл public/_redirects. Современный Cloudflare Pages автоматически понимает, что Vite-проекты — это SPA, и если файла /friends.html нет, он сам отдаст /index.html (статус 200). Роутер в JS всё сделает сам.

bash

rm public/_redirects
git push origin main
🔄 Как обновлять сайт в будущем?
Благодаря подключению GitHub, деплой происходит автоматически.
Каждый раз, когда ты меняешь код и делаешь пуш:

bash

git add .
git commit -m "update: new feature"
git push origin main
Cloudflare сам заметит изменения, пересоберет проект и обновит https://chili-app.pages.dev за 1-2 минуты.

Структура URL
URL
Назначение
https://chili-app.pages.dev	Frontend (сайт)
https://chili-app.pages.dev/api/auth	Backend: проверка Telegram
https://chili-app.pages.dev/api/activities	Backend: список активностей
https://t.me/chili_app_bot/app	Вход для пользователей