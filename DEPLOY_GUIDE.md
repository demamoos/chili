# 🚀 Деплой Chili на Cloudflare Pages + Telegram Mini App

## Шаг 1: Cloudflare Setup (5 мин)

### 1.1 Создать аккаунт
- [dash.cloudflare.com](https://dash.cloudflare.com) → Sign up

### 1.2 Создать Pages проект
1. **Pages** → **Create a project**
2. **Connect to Git** → выбрать GitLab репозиторий `chili-project`
3. **Build settings**:
   ```
   Build command:    npm run build
   Build output:     dist
   Root directory:   /
   ```
4. **Environment variables** (необязательно для начала):
   ```
   NODE_VERSION = 20
   ```
5. **Save and Deploy**

### 1.3 Получить API Token для CI/CD
1. Cloudflare Dashboard → **My Profile** (иконка в правом верхнем углу)
2. **API Tokens** → **Create Token**
3. **Custom token**:
   - **Token name**: `GitLab CI Chili Deploy`
   - **Permissions**: 
     - `Cloudflare Pages:Edit`
   - **Account Resources**: Include → твой аккаунт
   - **Zone Resources**: Include → твой домен (если есть)
4. **Continue to summary** → **Create Token**
5. **Скопируй токен** (показывается только один раз!)

### 1.4 Получить Account ID
- На любой странице Cloudflare Dashboard → правая колонка → **Account ID**

---

## Шаг 2: GitLab Setup (3 мин)

### 2.1 Добавить переменные в CI/CD
1. GitLab → **Settings** → **CI/CD** → **Variables** → **Add variable**
2. Добавь 2 переменные:

| Key | Value | Masked | Protected |
|---|---|---|---|
| `CF_ACCOUNT_ID` | Твой Account ID | ✅ | ✅ |
| `CF_API_TOKEN` | Твой API Token | ✅ | ✅ |

---

## Шаг 3: Первый деплой (2 мин)

```bash
git add .
git commit -m "chore: Cloudflare Pages deploy setup"
git push origin main
```

GitLab CI автоматически:
1. ✅ Линтит код
2. ✅ Собирает проект (`npm run build`)
3. ✅ Деплоит на `https://chili-app.pages.dev`

Смотри логи в GitLab → **CI/CD** → **Pipelines**

---

## Шаг 4: Telegram Mini App Setup (5 мин)

### 4.1 Создать бота
1. Открой **@BotFather** в Telegram
2. Отправь `/newbot`
3. Имя: `Chili`
4. Username: `chili_app_bot` (должно быть уникальным, придумай свой)
5. **Сохрани BOT_TOKEN** — он выглядит как `123456789:ABCdef...`

### 4.2 Создать Mini App
В @BotFather:
```
/mybots
→ Выбери chili_app_bot
→ Bot Settings
→ Menu Button
→ Configure menu button
→ Menu Button URL
```

Или создай отдельное приложение:
```
/newapp
→ Выбери chili_app_bot
→ Название: Chili
→ Описание: Досуг с друзьями, оплата криптой
→ URL: https://chili-app.pages.dev  ← твой Cloudflare URL
→ Загрузи иконку 512×512 PNG
```

### 4.3 Получить Mini App URL
BotFather выдаст ссылку:
```
https://t.me/chili_app_bot/app
```

Это точка входа для пользователей.

---

## Шаг 5: Добавить BOT_TOKEN в Cloudflare (2 мин)

### 5.1 Добавить переменную окружения
1. Cloudflare Dashboard → **Pages** → **chili-app**
2. **Settings** → **Environment variables**
3. **Add variable**:
   ```
   Name:  BOT_TOKEN
   Value: 123456789:ABCdef...  ← твой токен из BotFather
   ```
4. **Save**

Теперь Cloudflare Functions (backend API) могут валидировать `initData` от Telegram.

---

## Шаг 6: Кастомный домен (опционально, 5 мин)

### 6.1 Купить/добавить домен
1. Cloudflare Dashboard → **Pages** → **chili-app** → **Custom domains**
2. **Set up a custom domain**
3. Введи домен: `app.chili.io` (или любой)
4. Cloudflare проверит DNS и выдаст SSL автоматически

### 6.2 Обновить URL в BotFather
```
/mybots → chili_app_bot → Bot Settings → Menu Button → Configure menu button
→ Новый URL: https://app.chili.io
```

### 6.3 Обновить tonconnect-manifest.json
```json
{
  "url": "https://app.chili.io",
  "name": "Chili",
  "iconUrl": "https://app.chili.io/icon-256.png"
}
```

---

## Шаг 7: Тестирование

### 7.1 Открыть Mini App
```
https://t.me/chili_app_bot/app
```

Или:
1. Найди бота `@chili_app_bot`
2. Нажми **Start**
3. Должна появиться кнопка **Menu** (или **Launch** если использовал `/newapp`)

### 7.2 Чек-лист проверки
- [ ] Приложение открывается без ошибок
- [ ] Цвета подстраиваются под тему Telegram
- [ ] Кнопка "Назад" в Telegram работает
- [ ] Haptic feedback на кнопках (вибрация)
- [ ] TON Connect кошелёк подключается
- [ ] Оплата проходит (тестовая)
- [ ] Яндекс Карты открываются
- [ ] QR-код билета отображается

### 7.3 Дебаг
Если что-то не работает:
1. Открой Mini App
2. Нажми **⋮** → **Inspect Element** (на Android через Telegram Desktop)
3. Смотри Console на ошибки
4. Проверь Network → все запросы к `/api/*` должны возвращать 200

---

## Структура URL

| URL | Назначение |
|---|---|
| `https://chili-app.pages.dev` | Frontend (Vite build) |
| `https://chili-app.pages.dev/api/auth` | Backend: валидация Telegram |
| `https://chili-app.pages.dev/api/activities` | Backend: список активностей |
| `https://chili-app.pages.dev/api/booking` | Backend: создание бронирования |
| `https://t.me/chili_app_bot/app` | Точка входа для пользователей |

---

## Полезные команды

```bash
# Локальная разработка
npm run dev

# Сборка
npm run build

# Preview (как на Cloudflare)
npm run preview

# Линтинг
npm run lint

# Ручной деплой через Wrangler (если нужно)
npx wrangler pages deploy dist --project-name=chili-app
```

---

## Что дальше?

1. ✅ Замени `EQD...` в `src/js/screens.js` на реальный адрес смарт-контракта
2. ✅ Добавь реальные активности в `src/js/data.js` или подключи CMS
3. ✅ Настрой аналитику (Google Analytics / Amplitude)
4. ✅ Добавь push-уведомления через Telegram Bot API
5. ✅ Реализуй реальный NFT mint в Cloudflare Functions

---

## Поддержка

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [TON Connect Docs](https://docs.ton.org/develop/dapps/ton-connect/)
