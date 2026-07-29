(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new class{constructor(){this.routes={},window.addEventListener(`hashchange`,()=>this.resolve()),window.addEventListener(`popstate`,()=>this.resolve())}on(e,t){this.routes[e]=t}navigate(e,t=!0){t?window.history.pushState(null,``,`#`+e):window.location.hash=e,this.resolve()}resolve(){let[e,t]=(window.location.hash.slice(1)||`auth`).split(`/`);this.routes[e]&&this.routes[e](t)}back(){window.history.back()}},t=new class{constructor(e={}){this.state={...e},this.listeners=new Set}get(e){return this.state[e]}set(e,t){this.state[e]=t,this.notify(e,t)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(e,t){this.listeners.forEach(n=>n(e,t))}}({currentScreen:`auth`,isAuthenticated:!1,acceptedTerms:!1,userLocation:null,selectedActivity:null,selectedPayment:`free_nft`,user:null,wallet:null,history:[],activities:[],categories:[],favorites:JSON.parse(localStorage.getItem(`chili_favorites`)||`[]`),activeFilter:null}),n=new class{constructor(){this.tg=window.Telegram?.WebApp,this.ready=!1}init(){if(!this.tg){console.warn(`Telegram WebApp not available`);return}this.tg.ready(),this.tg.expand(),this.applyTheme(),this.setupViewport(),this.ready=!0,console.log(`Telegram initData:`,this.tg.initData),console.log(`Telegram user:`,this.tg.initDataUnsafe?.user)}getInitData(){return this.tg?.initData||``}getUser(){return this.tg?.initDataUnsafe?.user||null}requestGeolocation(){return new Promise((e,t)=>{navigator.geolocation||(console.warn(`Geolocation is not supported by this browser.`),e(null)),navigator.geolocation.getCurrentPosition(t=>{e({lat:t.coords.latitude,lng:t.coords.longitude})},t=>{console.warn(`Geolocation error:`,t.message),e(null)},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})})}applyTheme(){if(!this.tg)return;let e=this.tg.themeParams,t=document.documentElement;e.bg_color&&t.style.setProperty(`--tg-theme-bg-color`,e.bg_color),e.text_color&&t.style.setProperty(`--tg-theme-text-color`,e.text_color),e.hint_color&&t.style.setProperty(`--tg-theme-hint-color`,e.hint_color),e.button_color&&t.style.setProperty(`--tg-theme-button-color`,e.button_color),e.button_text_color&&t.style.setProperty(`--tg-theme-button-text-color`,e.button_text_color),e.secondary_bg_color&&t.style.setProperty(`--tg-theme-secondary-bg-color`,e.secondary_bg_color)}setupViewport(){this.tg&&(this.tg.onEvent(`viewportChanged`,()=>{document.documentElement.style.setProperty(`--safe-area-top`,this.tg.viewportStableHeight+`px`)}),this.tg.isExpanded&&this.tg.requestFullscreen?.())}haptic(e=`light`){this.tg?.HapticFeedback&&this.tg.HapticFeedback.impactOccurred(e)}setHeaderColor(e){this.tg&&this.tg.setHeaderColor(e)}showBackButton(e){this.tg?.BackButton&&(e?this.tg.BackButton.show():this.tg.BackButton.hide())}setMainButton(e,t,n){this.tg?.MainButton&&(this.tg.MainButton.setText(e),t?this.tg.MainButton.show():this.tg.MainButton.hide(),this.tg.MainButton.onClick(n))}share(e,t){this.tg&&this.tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(e)}&text=${encodeURIComponent(t)}`)}close(){this.tg&&this.tg.close()}},r={el(e){return document.getElementById(e)},create(e,t={},n=[]){let r=document.createElement(e);return Object.entries(t).forEach(([e,t])=>{e===`text`?r.textContent=t:e===`html`?r.innerHTML=t:r.setAttribute(e,t)}),n.forEach(e=>{typeof e==`string`?r.appendChild(document.createTextNode(e)):r.appendChild(e)}),r},clear(e){for(;e.firstChild;)e.removeChild(e.firstChild)},show(e){e.style.display=``},hide(e){e.style.display=`none`}},i=new class{constructor(){this.connector=null,this.connected=!1,this.address=null}async init(){if(typeof TonConnectUI>`u`){console.warn(`TON Connect UI not loaded`);return}this.connector=new TonConnectUI({manifestUrl:`https://chili-app.pages.dev/tonconnect-manifest.json`}),this.connector.onStatusChange(e=>{this.connected=!!e,this.address=e?.account?.address||null,this.updateUI()})}updateUI(){let e=document.getElementById(`wallet-btn`);e&&(this.connected&&this.address?(e.textContent=`💎 `+this.address.slice(0,6)+`...`+this.address.slice(-4),e.classList.add(`connected`),e.setAttribute(`aria-label`,`Кошелек подключен: `+this.address)):(e.textContent=`💎 Подключить`,e.classList.remove(`connected`),e.setAttribute(`aria-label`,`Подключить кошелек TON`)),e.style.display=`block`)}async connect(){if(!this.connector){window.showToast?.(`❌ TON Connect недоступен`);return}try{await this.connector.connectWallet()}catch(e){console.error(`TON Connect error:`,e),window.showToast?.(`❌ Ошибка подключения кошелька`)}}async sendTransaction(e,t,n){if(!this.connector||!this.connected)return window.showToast?.(`❌ Сначала подключите кошелек`),null;try{return await this.connector.sendTransaction({validUntil:Math.floor(Date.now()/1e3)+600,messages:[{address:e,amount:String(t),payload:n||``}]})}catch(e){return console.error(`Transaction error:`,e),window.showToast?.(`❌ Транзакция отменена или не удалась`),null}}},a=new class{constructor(e=``){this.baseURL=e,this.token=null}setToken(e){this.token=e}async request(e,t={}){let n=this.baseURL+e,r={method:t.method||`GET`,headers:{"Content-Type":`application/json`,...t.headers||{}}};t.body&&(r.body=t.body),this.token&&(r.headers.Authorization=`Bearer ${this.token}`);try{let e=await fetch(n,r);if(!e.ok){let t=await e.json().catch(()=>({error:`HTTP ${e.status}`}));throw Error(t.error||`HTTP ${e.status}`)}return await e.json()}catch(e){throw console.error(`API Error:`,e),e}}async auth(e){let t=await this.request(`/api/auth/`,{method:`POST`,body:JSON.stringify(e)});return this.setToken(t.token),t}async getActivities(){return this.request(`/api/activities/`)}async getActivity(e){return this.request(`/api/activities/${e}/`)}async createBooking(e,t){return this.request(`/api/booking/`,{method:`POST`,body:JSON.stringify({activityId:e,paymentType:t})})}}(``),o=`EQD...`;function s(){let e=localStorage.getItem(`chili_jwt`);if(e){a.setToken(e);let n=JSON.parse(localStorage.getItem(`chili_user`)||`null`);if(n)return t.set(`user`,n),t.set(`isAuthenticated`,!0),c(`home`),l(0),!0}return c(`auth`),!1}function c(e){let i=t.get(`history`),a=t.get(`currentScreen`);a&&a!==e&&i.push(a),t.set(`history`,i),t.set(`currentScreen`,e),document.querySelectorAll(`.screen`).forEach(e=>e.classList.remove(`active`));let o=r.el(e+`-screen`);o&&(o.classList.add(`active`),o.scrollTop=0);let s=r.el(`bottom-nav`);[`auth`,`success`,`detail`,`payment`].includes(e)?(s.style.display=`none`,n.showBackButton(e!==`auth`)):(s.style.display=`flex`,n.showBackButton(!1)),e===`home`&&t.get(`isAuthenticated`)&&f();let c={home:0,friends:1,profile:2};c[e]!==void 0&&l(c[e])}function l(e){document.querySelectorAll(`.nav-item`).forEach((t,n)=>{t.classList.toggle(`active`,n===e),t.setAttribute(`aria-current`,n===e?`page`:`false`)})}function u(){let e=t.get(`history`);if(e.length>0){let n=e.pop();t.set(`history`,e),c(n)}else c(`home`),l(0)}async function d(){let e=r.el(`terms-checkbox`);if(!e||!e.checked){T(`❌ Пожалуйста, примите условия использования`),n.haptic(`heavy`);return}T(`✈️ Авторизация через Telegram...`),E(!0);try{let e=await n.requestGeolocation();t.set(`userLocation`,e);let r=n.getInitData();if(!r){E(!1),T(`❌ Откройте приложение внутри Telegram`);return}let i=await a.auth({initData:r,location:t.get(`userLocation`),acceptedTerms:!0});a.setToken(i.token),localStorage.setItem(`chili_jwt`,i.token);let o={name:i.user?.first_name||`Пользователь`,id:i.user?.id?.toString()||`tg_user`,username:i.user?.username};t.set(`isAuthenticated`,!0),t.set(`acceptedTerms`,!0),E(!1),c(`home`),l(0),T(`✅ Добро пожаловать, ${o.name}!`),n.haptic(`success`)}catch(e){E(!1),console.error(`Auth error:`,e),T(`❌ Ошибка авторизации: `+e.message),n.haptic(`heavy`)}}async function f(){let e=t.get(`user`),n=r.el(`home-header-title`);n&&e&&(n.textContent=`Привет, ${e.name}! 👋`);let i=r.el(`home-user-location`);t.get(`userLocation`)?i.textContent=`Рядом с вами`:i.textContent=`Весь мир`;try{let e=await a.getActivities();t.set(`activities`,e);let n=[`Спорт`,`Развлечения`,`Еда`,`Туризм`,`Образование`,`Домашние животные`],r=[...new Set(e.map(e=>e.yandexCategory))].sort((e,t)=>n.indexOf(e)-n.indexOf(t));t.set(`categories`,r),p(),m(),h()}catch(e){console.error(`Failed to load activities:`,e),T(`❌ Ошибка загрузки мероприятий`)}}function p(){let e=r.el(`categories-container`);r.clear(e);let n=t.get(`categories`),i={Спорт:`⚽`,Развлечения:`🎮`,Еда:`🍷`,Туризм:`🏔️`,Образование:`🎓`,"Домашние животные":`🐕`};n.forEach(t=>{let n=r.create(`button`,{class:`category-item`,"data-action":`filter-category`,"data-cat":t,role:`listitem`,"aria-label":`Фильтр: ${t}`},[r.create(`div`,{class:`category-icon`,"aria-hidden":`true`},[i[t]||`📂`]),r.create(`div`,{class:`category-name`},[t])]);e.appendChild(n)})}function m(){let e=r.el(`activities-container`);r.clear(e);let n=t.get(`activities`),i=t.get(`activeFilter`),a=t.get(`favorites`),o=i?n.filter(e=>e.yandexCategory===i):n,s=r.el(`activities-title`),c=r.el(`clear-filter`);if(s.textContent=i||`Все мероприятия`,c.style.display=i?`inline-block`:`none`,o.length===0){e.appendChild(r.create(`div`,{style:`text-align:center; padding:40px; color:var(--tg-text-secondary);`},[`В этой категории пока нет мероприятий 😔`]));return}o.forEach(t=>{let n=a.includes(t.id),i=r.create(`div`,{class:`activity-card animate-in`,"data-action":`open-activity`,"data-id":t.id,tabindex:`0`,role:`button`},[r.create(`div`,{class:`activity-image`,style:`background: linear-gradient(135deg, #1a1a2e, #0f3460);`,"aria-hidden":`true`},[t.emoji,r.create(`div`,{class:`activity-price-tag`},[t.currency===`FREE`?`Бесплатно`:t.price+` `+t.currency]),r.create(`button`,{class:`fav-btn`,style:`position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.5); border:none; border-radius:50%; width:32px; height:32px; font-size:16px; cursor:pointer; color:${n?`var(--tg-yellow)`:`white`};`,"data-action":n?`remove-fav`:`add-fav`,"data-id":t.id,"aria-label":n?`Убрать из избранного`:`Добавить в избранное`},[n?`⭐`:`☆`])]),r.create(`div`,{class:`activity-info`},[r.create(`div`,{class:`activity-title`},[t.title]),r.create(`div`,{class:`activity-meta`},[t.coords?`📍 Рядом`:`💻 Онлайн`,` • `,t.subCategory]),r.create(`div`,{class:`activity-friends`},[r.create(`span`,{class:`activity-friends-text`,style:`font-size:12px; color:var(--tg-blue-light);`},t.friends.length>0?`👥 ${t.friends.join(`, `)} идут`:`Будь первым!`)])])]);e.appendChild(i)})}function h(){let e=r.el(`favorites-section`),n=r.el(`favorites-container`);r.clear(n);let i=t.get(`favorites`),a=t.get(`activities`);if(i.length===0){e.style.display=`none`;return}e.style.display=`block`,i.forEach(e=>{let t=a.find(t=>t.id===e);if(!t)return;let i=r.create(`div`,{class:`friend-card`,style:`min-width:140px; cursor:pointer;`,"data-action":`open-activity`,"data-id":t.id,role:`listitem`},[r.create(`div`,{class:`friend-avatar`,"aria-hidden":`true`},[t.emoji]),r.create(`div`,{class:`friend-name`,style:`font-size:14px;`},[t.title]),r.create(`div`,{class:`friend-activity`,style:`font-size:12px; color:var(--tg-text-secondary);`},[t.yandexCategory])]);n.appendChild(i)})}function g(e,r){let i=t.get(`favorites`);r?(i.includes(e)||i.push(e),T(`⭐ Добавлено в избранное`)):(i=i.filter(t=>t!==e),T(`☆ Удалено из избранного`)),t.set(`favorites`,i),localStorage.setItem(`chili_favorites`,JSON.stringify(i)),m(),h(),n.haptic(`light`)}function _(e){let i=activities[e];if(!i)return;t.set(`selectedActivity`,i),r.el(`detail-emoji`).textContent=i.emoji,r.el(`detail-title`).textContent=i.title,r.el(`detail-rating`).textContent=i.rating,r.el(`detail-desc`).textContent=i.desc,r.el(`detail-location`).innerHTML=i.location,r.el(`detail-price`).textContent=i.price,r.el(`detail-fiat`).textContent=`≈ `+i.rubPrice.toLocaleString(`ru-RU`)+` ₽`;let a=r.el(`map-section`);i.coords?(a.style.display=`block`,r.el(`map-address`).textContent=i.address):a.style.display=`none`;let o=r.el(`detail-friends`);if(r.clear(o),i.friends.length>0)i.friends.forEach(e=>{let t=r.create(`div`,{class:`detail-friend`,role:`listitem`},[r.create(`div`,{class:`detail-friend-avatar`,"aria-hidden":`true`},[e.avatar]),r.create(`div`,{class:`detail-friend-name`},[e.name]),r.create(`div`,{class:`detail-friend-status`},[e.status])]);o.appendChild(t)});else{let e=r.create(`div`,{style:`color:var(--tg-text-secondary); font-size:14px;`},[`Пока никто из друзей не идёт. Будь первым!`]);o.appendChild(e)}c(`detail`),n.setMainButton(`Забронировать`,!0,()=>y())}function v(){let e=t.get(`selectedActivity`);if(!e||!e.coords){T(`🗺️ Это онлайн-активность — маршрут не требуется`);return}let n=`https://yandex.ru/maps/?rtext=~${e.coords}&rtt=auto`;window.open(n,`_blank`,`noopener,noreferrer`),T(`🗺️ Яндекс Карты открыты в новой вкладке`)}function y(){let e=t.get(`selectedActivity`);e&&(r.el(`pay-activity`).textContent=e.title,r.el(`pay-price`).textContent=e.price,b(`usdt`),c(`payment`),n.setMainButton(`Оплатить`,!0,()=>x()))}function b(e){t.set(`selectedPayment`,e),document.querySelectorAll(`.payment-option`).forEach(t=>{let n=t.dataset.type===e;t.classList.toggle(`selected`,n),t.setAttribute(`aria-checked`,n)});let n=t.get(`selectedActivity`);if(!n||n.priceRaw<=0){r.el(`pay-total`).textContent=`Бесплатно`,r.el(`pay-fee`).textContent=`—`,r.el(`pay-conversion-row`).style.display=`none`;return}let i=r.el(`pay-conversion-row`),a=r.el(`pay-fee`),o=r.el(`pay-security`),s=``;switch(e){case`usdt`:s=n.priceRaw+.1+` USDT`,a.textContent=`~0.1 USDT`,a.style.color=`var(--tg-green)`,i.style.display=`none`,o.textContent=`🔒 Транзакция защищена смарт-контрактом TON`;break;case`ton`:s=(n.priceRaw/3.7).toFixed(2)+` TON`,a.textContent=`~0.05 TON`,a.style.color=`var(--tg-green)`,i.style.display=`none`,o.textContent=`🔒 Транзакция защищена смарт-контрактом TON`;break;case`chili`:s=(n.priceRaw*40).toFixed(0)+` $CHILI`,a.textContent=`Без комиссии`,a.style.color=`var(--tg-green)`,i.style.display=`none`,o.textContent=`🔒 Транзакция защищена смарт-контрактом TON`;break;case`card_rub`:s=n.rubPrice.toLocaleString(`ru-RU`)+` ₽`,a.textContent=`+2% комиссия банка`,a.style.color=`var(--tg-orange)`,i.style.display=`flex`,r.el(`pay-conversion`).textContent=n.priceRaw+` USDT ≈ `+n.rubPrice.toLocaleString(`ru-RU`)+` ₽`,o.textContent=`🔒 Платёж обрабатывается банком-партнёром`;break;case`card_usd`:s=`$`+n.priceRaw.toFixed(2),a.textContent=`+3% международная комиссия`,a.style.color=`var(--tg-orange)`,i.style.display=`none`,o.textContent=`🔒 Платёж обрабатывается банком-партнёром`;break;case`sbp`:s=n.rubPrice.toLocaleString(`ru-RU`)+` ₽`,a.textContent=`Без комиссии`,a.style.color=`var(--tg-green)`,i.style.display=`flex`,r.el(`pay-conversion`).textContent=n.priceRaw+` USDT ≈ `+n.rubPrice.toLocaleString(`ru-RU`)+` ₽`,o.textContent=`⚡ Мгновенный перевод через СБП`;break}r.el(`pay-total`).textContent=s}async function x(){let e=t.get(`selectedActivity`),s=t.get(`selectedPayment`);if(e){if([`usdt`,`ton`,`chili`].includes(s)&&i.connected){T(`⏳ Отправка транзакции в блокчейн...`),E(!0);let t=Math.floor(s===`ton`?e.priceRaw/3.7*1e9:e.priceRaw*1e6),n=await i.sendTransaction(o,t);if(E(!1),!n)return}else if([`usdt`,`ton`,`chili`].includes(s)&&!i.connected){T(`❌ Сначала подключите TON кошелек`),i.connect();return}else T(`⏳ Подтверждение платежа...`),E(!0);try{await a.createBooking(e.id,s),E(!1),r.el(`ticket-title`).textContent=e.title;let t=e.price;s===`card_rub`||s===`sbp`?t=e.rubPrice.toLocaleString(`ru-RU`)+` ₽`:s===`card_usd`&&(t=`$`+e.priceRaw),r.el(`ticket-payment`).textContent=t,c(`success`),T(`🎉 Бронирование подтверждено! NFT билет создан.`),n.setMainButton(`На главную`,!0,()=>{c(`home`),l(0)})}catch(e){E(!1),T(`❌ Ошибка бронирования: `+e.message)}}}function S(){let e=`https://t.me/chili_app_bot?start=ref_`+(t.get(`user`)?.id||`guest`);navigator.clipboard?navigator.clipboard.writeText(e).then(()=>{T(`🔗 Ссылка скопирована! Отправь другу в Telegram`)}):n.share(e,`Присоединяйся к Chili!`)}function C(){n.share(`https://t.me/chili_app_bot`,`Я забронировал активность в Chili! Присоединяйся!`),T(`📤 Приглашение отправлено в Telegram!`)}function w(){t.set(`user`,null),t.set(`wallet`,null),t.set(`history`,[]),t.set(`isAuthenticated`,!1),a.setToken(null),localStorage.removeItem(`chili_jwt`),localStorage.removeItem(`chili_user`),c(`auth`),T(`👋 Вы вышли из аккаунта`)}function T(e){let t=r.el(`toast`);t.textContent=e,t.classList.add(`show`),setTimeout(()=>t.classList.remove(`show`),3e3)}function E(e){r.el(`loading-overlay`).classList.toggle(`active`,e)}window.showToast=T;var D={auth:`
    <div id="auth-screen" class="screen active" role="main" aria-label="Экран авторизации">
      <div class="logo-container">
        <span class="logo-emoji" aria-hidden="true">❄️</span>
      </div>
      <h1 class="auth-title">Chili</h1>
      <p class="auth-subtitle">Найди свой досуг. Делай это с друзьями из Telegram.</p>
      
      <!-- ИСПРАВЛЕНО: Добавлен чекбокс для соглашения на обработку данных -->
      <div style="width:100%; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px; padding:0 10px;">
        <input type="checkbox" id="terms-checkbox" style="width:20px; height:20px; margin-top:2px; accent-color:var(--tg-blue); cursor:pointer;" aria-label="Согласие с правилами">
        <label for="terms-checkbox" style="font-size:13px; color:var(--tg-text-secondary); line-height:1.4; cursor:pointer;">
          Я соглашаюсь с <a href="https://chili-app.pages.dev/terms" target="_blank" style="color:var(--tg-blue-light); text-decoration:underline;">условиями использования</a> 
          и <a href="https://chili-app.pages.dev/privacy" target="_blank" style="color:var(--tg-blue-light); text-decoration:underline;">политикой конфиденциальности</a>, 
          включая обработку моей геолокации для поиска мероприятий рядом.
        </label>
      </div>

      <!-- ИСПРАВЛЕНО: Убрана кнопка "Гостевой вход". Вход только через TG -->
      <button class="btn btn-primary" data-action="auth-telegram" aria-label="Войти через Telegram">
        <span aria-hidden="true">✈️</span> Войти через Telegram
      </button>
      
      <div class="features-list">
        <div class="feature-item animate-in delay-1">
          <span class="feature-icon" aria-hidden="true">⚽</span>
          <div class="feature-text">
            <strong>Агрегатор активностей</strong>
            Спорт, игры, квесты, образование — всё в одном месте
          </div>
        </div>
        <div class="feature-item animate-in delay-2">
          <span class="feature-icon" aria-hidden="true">👥</span>
          <div class="feature-text">
            <strong>Друзья из Telegram</strong>
            Узнавай, чем занимаются твои контакты, и присоединяйся
          </div>
        </div>
        <div class="feature-item animate-in delay-3">
          <span class="feature-icon" aria-hidden="true">📍</span>
          <div class="feature-text">
            <strong>Мероприятия рядом</strong>
            Мы найдем лучшие активности ближе к вам
          </div>
        </div>
      </div>
    </div>
  `,home:`
    <div id="home-screen" class="screen" role="main" aria-label="Главный экран">
      <div class="screen-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <!-- ИСПРАВЛЕНО: Имя подставляется динамически, id оставлен для screens.js -->
            <div class="header-title" id="home-header-title">Привет! 👋</div>
            <div class="header-subtitle">Чем займёмся сегодня?</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; background:var(--tg-surface); padding:8px 14px; border-radius:20px; border:1px solid var(--tg-border);">
            <span style="font-size:18px;" aria-hidden="true">📍</span>
            <span id="home-user-location" style="font-size:13px; color:var(--tg-text-secondary);">Определяется...</span>
          </div>
        </div>
      </div>

      <!-- НОВОЕ: Секция Избранное (появится только если есть избранное) -->
      <div class="section" id="favorites-section" style="display:none;">
        <div class="section-title">
          <span aria-hidden="true">⭐</span> Избранное
        </div>
        <div id="favorites-container" class="friends-strip"></div>
      </div>

      <div class="section">
        <div class="section-title" aria-hidden="true">📂 Категории</div>
        <!-- НОВОЕ: Контейнер для динамических категорий с бэкенда -->
        <div id="categories-container" class="categories-grid" role="list" aria-label="Категории активностей"></div>
      </div>

      <div class="section">
        <div class="section-title">
          <span aria-hidden="true">✨</span> <span id="activities-title">Все мероприятия</span>
          <button class="section-link" data-action="clear-filter" style="display:none;" aria-label="Сбросить фильтр">Все</button>
        </div>
        <!-- НОВОЕ: Контейнер для динамических карточек активностей -->
        <div id="activities-container" role="list" aria-label="Список активностей"></div>
      </div>
    </div>
  `,detail:`
    <div id="detail-screen" class="screen" role="main" aria-label="Детали активности">
      <div class="detail-hero" id="detail-hero" aria-hidden="true">
        <button class="detail-back" data-action="go-back" aria-label="Назад">←</button>
        <span id="detail-emoji" style="font-size:100px;">⚽</span>
      </div>
      <div class="detail-content">
        <h1 class="detail-title" id="detail-title">Футбол с друзьями</h1>
        <div class="detail-rating">
          <span aria-hidden="true">⭐</span>
          <span id="detail-rating">4.8</span>
          <span style="color:var(--tg-text-secondary)">•</span>
          <span style="color:var(--tg-text-secondary)">128 отзывов</span>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Описание</div>
          <p class="detail-description" id="detail-desc">
            Еженедельный футбол на отличном поле в Al Qudra. Все уровни приветствуются! 
            После игры — социализация и крипто-обсуждения в ближайшем кафе.
          </p>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Дата и место</div>
          <p class="detail-description" id="detail-location">
            📍 Дубай, Al Qudra Sports Complex<br>
            🕖 Четверг, 19:00 — 21:00
          </p>
        </div>
        <div id="map-section" class="detail-section">
          <div class="detail-section-title" aria-hidden="true">🗺️ Как добраться</div>
          <div class="map-section">
            <div class="map-container">
              <div class="map-grid" aria-hidden="true"></div>
              <div class="map-pin" aria-hidden="true">📍</div>
              <div class="map-overlay">
                <div class="map-address" id="map-address">Al Qudra Sports Complex, Dubai</div>
                <button class="map-btn" data-action="open-yandex" aria-label="Построить маршрут в Яндекс Картах">
                  <span aria-hidden="true">🗺️</span> Маршрут
                </button>
              </div>
            </div>
          </div>
          <button class="map-yandex-btn" data-action="open-yandex" aria-label="Открыть в Яндекс Картах">
            <span aria-hidden="true">🗺️</span> Открыть в Яндекс Картах
          </button>
          <div style="padding:0 20px; margin-top:8px;">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span class="tag" aria-label="15 минут от центра">🚗 15 мин от центра</span>
              <span class="tag tag-green" aria-label="Есть парковка">🅿️ Парковка</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Идут из твоих друзей</div>
          <div class="detail-friends-row" id="detail-friends" role="list" aria-label="Друзья, идущие на активность"></div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">Организатор</div>
          <div style="display:flex; align-items:center; gap:12px; padding:14px; background:var(--tg-surface); border-radius:16px; border:1px solid var(--tg-border);">
            <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, var(--tg-blue), var(--tg-purple)); display:flex; align-items:center; justify-content:center; font-size:24px;" aria-hidden="true">🏟️</div>
            <div>
              <div style="font-weight:600;">Dubai Football Community</div>
              <div style="font-size:13px; color:var(--tg-text-secondary);">⭐ 4.9 • 45 мероприятий</div>
            </div>
          </div>
        </div>
        <div style="height:100px;"></div>
      </div>
      <div class="detail-footer">
        <div>
          <div class="detail-price" id="detail-price">25 USDT</div>
          <div class="detail-price-crypto" id="detail-fiat">≈ 2 250 ₽</div>
        </div>
        <button class="btn btn-primary" style="width:auto; padding:14px 32px;" data-action="open-payment" aria-label="Забронировать активность">
          Забронировать
        </button>
      </div>
    </div>
  `,friends:`
    <div id="friends-screen" class="screen" role="main" aria-label="Друзья">
      <div class="screen-header">
        <div class="header-title" aria-hidden="true">👥 Друзья</div>
        <div class="header-subtitle">Чем занимаются твои контакты</div>
      </div>
      <div class="section">
        <div class="section-title">Сейчас онлайн</div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div style="position:relative;">
            <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">🧑‍💻</div>
            <div style="position:absolute; bottom:0; right:0; width:14px; height:14px; background:var(--tg-green); border-radius:50%; border:2px solid var(--tg-bg);" aria-hidden="true"></div>
          </div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Иван Петров</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Играет в CS2 турнир</div>
            <div style="font-size:12px; color:var(--tg-blue-light); margin-top:4px;" aria-hidden="true">🎮 12 участников • Награда: 50 USDT</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="cs2" aria-label="Войти в CS2 турнир">Войти</button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Ближайшие планы</div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">👩‍🦰</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Мария Козлова</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Йога в парке Гези</div>
            <div style="font-size:12px; color:var(--tg-orange); margin-top:4px;" aria-hidden="true">🕖 Завтра 8:00</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="yoga" aria-label="Присоединиться к йоге">+ Я</button>
        </div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">🧔</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Дмитрий Волков</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Футбол Al Qudra</div>
            <div style="font-size:12px; color:var(--tg-green); margin-top:4px;" aria-hidden="true">📅 Четверг 19:00</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="football" aria-label="Присоединиться к футболу">+ Я</button>
        </div>
        <div class="friend-card" style="width:100%; margin-bottom:12px; display:flex; align-items:center; gap:14px;" role="listitem">
          <div class="friend-avatar" style="margin:0; width:56px; height:56px;" aria-hidden="true">👱‍♀️</div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:16px;">Анна Смирнова</div>
            <div style="font-size:14px; color:var(--tg-text-secondary); margin-top:2px;">Винная дегустация</div>
            <div style="font-size:12px; color:var(--tg-purple); margin-top:4px;" aria-hidden="true">🍷 Суббота 18:00</div>
          </div>
          <button class="join-btn" style="width:auto; padding:10px 18px;" data-action="open-activity" data-id="wine" aria-label="Присоединиться к дегустации">+ Я</button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Пригласить друзей</div>
        <div style="padding:20px; background:linear-gradient(135deg, rgba(0,136,204,0.1), rgba(175,82,222,0.1)); border:1px solid var(--tg-border); border-radius:20px; text-align:center;">
          <div style="font-size:40px; margin-bottom:10px;" aria-hidden="true">🎁</div>
          <div style="font-weight:700; font-size:16px; margin-bottom:6px;">Пригласи друга — получи 50 $CHILI</div>
          <div style="font-size:14px; color:var(--tg-text-secondary); margin-bottom:16px;">За каждого друга, который забронирует активность</div>
          <button class="btn btn-primary" data-action="share-link" aria-label="Поделиться ссылкой с другом">
            📤 Поделиться ссылкой
          </button>
        </div>
      </div>
    </div>
  `,profile:`
    <div id="profile-screen" class="screen" role="main" aria-label="Профиль">
      <div class="profile-header">
        <div class="profile-avatar-large" aria-hidden="true">🧑‍💼</div>
        <div class="profile-name">Савва Крипто</div>
        <div class="profile-handle">@savva_chili</div>
        <div class="profile-stats" role="list" aria-label="Статистика профиля">
          <div class="stat" role="listitem">
            <div class="stat-value">24</div>
            <div class="stat-label">Бронирования</div>
          </div>
          <div class="stat" role="listitem">
            <div class="stat-value">12</div>
            <div class="stat-label">Друзей</div>
          </div>
          <div class="stat" role="listitem">
            <div class="stat-value">8</div>
            <div class="stat-label">NFT Бейджей</div>
          </div>
        </div>
      </div>
      <div class="streak-banner">
        <div class="streak-icon" aria-hidden="true">🔥</div>
        <div class="streak-text">
          <div class="streak-title">Streak: 12 дней!</div>
          <div class="streak-subtitle">Ты на 3-м месте среди друзей. До 15 дней — бейдж «Огненный».</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">🏆 NFT Бейджи</div>
        <div class="nft-grid" role="list" aria-label="NFT бейджи">
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">⚽</div>
            <div>Футболист</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🧘</div>
            <div>Йог</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🎮</div>
            <div>Геймер</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🍷</div>
            <div>Сомелье</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🎓</div>
            <div>Студент</div>
          </div>
          <div class="nft-badge earned" role="listitem">
            <div class="nft-icon" aria-hidden="true">🎯</div>
            <div>Квестер</div>
          </div>
          <div class="nft-badge" role="listitem">
            <div class="nft-icon" style="opacity:0.3;" aria-hidden="true">🔥</div>
            <div style="opacity:0.5;">Огненный</div>
          </div>
          <div class="nft-badge" role="listitem">
            <div class="nft-icon" style="opacity:0.3;" aria-hidden="true">💎</div>
            <div style="opacity:0.5;">VIP</div>
          </div>
          <div class="nft-badge" role="listitem">
            <div class="nft-icon" style="opacity:0.3;" aria-hidden="true">👑</div>
            <div style="opacity:0.5;">Король</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">📅 Мои бронирования</div>
        <div class="booking-item" role="listitem">
          <div class="booking-icon" aria-hidden="true">⚽</div>
          <div class="booking-info">
            <div class="booking-title">Футбол с друзьями</div>
            <div class="booking-meta">📍 Al Qudra • чт 19:00</div>
            <span class="booking-status status-confirmed">✅ Подтверждено</span>
          </div>
        </div>
        <div class="booking-item" role="listitem">
          <div class="booking-icon" aria-hidden="true">🧘‍♀️</div>
          <div class="booking-info">
            <div class="booking-title">Утренняя йога</div>
            <div class="booking-meta">📍 Парк Гези • пт 8:00</div>
            <span class="booking-status status-upcoming">⏳ Ожидается</span>
          </div>
        </div>
        <div class="booking-item" role="listitem">
          <div class="booking-icon" aria-hidden="true">🗝️</div>
          <div class="booking-info">
            <div class="booking-title">Квест «Алькатрас»</div>
            <div class="booking-meta">📍 Тверская • сб 16:00</div>
            <span class="booking-status status-upcoming">⏳ Ожидается</span>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">⚙️ Настройки</div>
        <div style="background:var(--tg-surface); border-radius:16px; border:1px solid var(--tg-border); overflow:hidden;" role="list">
          <div style="padding:16px 20px; border-bottom:1px solid var(--tg-border); display:flex; justify-content:space-between; align-items:center;" role="listitem">
            <span>🔔 Уведомления</span>
            <span style="color:var(--tg-green); font-weight:600;">Вкл</span>
          </div>
          <div style="padding:16px 20px; border-bottom:1px solid var(--tg-border); display:flex; justify-content:space-between; align-items:center;" role="listitem">
            <span>🌙 Тёмная тема</span>
            <span style="color:var(--tg-green); font-weight:600;">Вкл</span>
          </div>
          <div style="padding:16px 20px; border-bottom:1px solid var(--tg-border); display:flex; justify-content:space-between; align-items:center;" role="listitem">
            <span>💰 Валюта отображения</span>
            <span style="color:var(--tg-text-secondary);">USDT / ₽</span>
          </div>
          <button style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; color:var(--tg-red); width:100%; background:none; border:none; cursor:pointer; font-size:inherit;" data-action="logout" role="listitem" aria-label="Выйти из аккаунта">
            <span>🚪 Выйти</span>
          </button>
        </div>
      </div>
    </div>
  `,payment:`
    <div id="payment-screen" class="screen" role="main" aria-label="Оплата">
      <div class="screen-header">
        <button class="detail-back" data-action="go-back" aria-label="Назад" style="position:relative; top:0; left:0; display:inline-flex; margin-bottom:10px;">←</button>
        <div class="header-title" aria-hidden="true">💳 Оплата</div>
        <div class="header-subtitle">Выбери способ оплаты</div>
      </div>
      <div class="payment-options" role="radiogroup" aria-label="Способы оплаты">
        <div class="payment-option selected" data-action="select-payment" data-type="usdt" role="radio" aria-checked="true" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #26a17b, #2ecc71);" aria-hidden="true">💵</div>
          <div class="payment-info">
            <div class="payment-name">USDT (TRC-20)</div>
            <div class="payment-balance">Баланс: 450 USDT</div>
          </div>
          <div class="payment-check" aria-hidden="true">✓</div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="ton" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #0088cc, #2aabee);" aria-hidden="true">💎</div>
          <div class="payment-info">
            <div class="payment-name">TON</div>
            <div class="payment-balance">Баланс: 120 TON</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="chili" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #af52de, #ff2d55);" aria-hidden="true">❄️</div>
          <div class="payment-info">
            <div class="payment-name">$CHILI (токен)</div>
            <div class="payment-balance">Баланс: 1,240 $CHILI</div>
            <div style="font-size:12px; color:var(--tg-green); margin-top:2px;">💰 Cashback 10%</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div style="margin: 8px 0 12px; padding-left: 8px; font-size: 13px; color: var(--tg-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;" aria-hidden="true">
          💳 Фиатные деньги
        </div>
        <div class="payment-option" data-action="select-payment" data-type="card_rub" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #fc3f1d, #ff6b4d);" aria-hidden="true">💳</div>
          <div class="payment-info">
            <div class="payment-name">Банковская карта <span class="fiat-badge">RUB</span></div>
            <div class="payment-balance">Visa / Mastercard / МИР</div>
            <div style="font-size:12px; color:var(--tg-text-secondary); margin-top:2px;">Конвертация по курсу ЦБ</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="card_usd" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #1e3a8a, #3b82f6);" aria-hidden="true">💳</div>
          <div class="payment-info">
            <div class="payment-name">Банковская карта <span class="fiat-badge" style="background:rgba(59,130,246,0.15); color:#60a5fa;">USD</span></div>
            <div class="payment-balance">Visa / Mastercard</div>
            <div style="font-size:12px; color:var(--tg-text-secondary); margin-top:2px;">Для международных карт</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
        <div class="payment-option" data-action="select-payment" data-type="sbp" role="radio" aria-checked="false" tabindex="0">
          <div class="payment-icon" style="background:linear-gradient(135deg, #7c3aed, #a78bfa);" aria-hidden="true">📲</div>
          <div class="payment-info">
            <div class="payment-name">Система быстрых платежей</div>
            <div class="payment-balance">СБП по номеру телефона</div>
            <div style="font-size:12px; color:var(--tg-green); margin-top:2px;">⚡ Мгновенно • Без комиссии</div>
          </div>
          <div class="payment-check" aria-hidden="true"></div>
        </div>
      </div>
      <div class="summary-box">
        <div class="summary-row">
          <span style="color:var(--tg-text-secondary);">Активность</span>
          <span id="pay-activity">Футбол с друзьями</span>
        </div>
        <div class="summary-row">
          <span style="color:var(--tg-text-secondary);">Стоимость</span>
          <span id="pay-price">25 USDT</span>
        </div>
        <div class="summary-row" id="pay-conversion-row" style="display:none;">
          <span style="color:var(--tg-text-secondary);">Конвертация</span>
          <span id="pay-conversion" style="color:var(--tg-orange);"></span>
        </div>
        <div class="summary-row">
          <span style="color:var(--tg-text-secondary);">Комиссия</span>
          <span id="pay-fee" style="color:var(--tg-green);">~0.1 USDT</span>
        </div>
        <div class="summary-row total">
          <span>Итого</span>
          <span id="pay-total" style="color:var(--tg-blue-light);">25.1 USDT</span>
        </div>
      </div>
      <div style="padding:0 20px 20px;">
        <button class="btn btn-primary" data-action="process-payment" aria-label="Подтвердить и оплатить">
          <span aria-hidden="true">🔒</span> Подтвердить и оплатить
        </button>
        <div style="text-align:center; margin-top:12px; font-size:12px; color:var(--tg-text-secondary);">
          <span id="pay-security">🔒 Транзакция защищена смарт-контрактом TON</span>
        </div>
      </div>
    </div>
  `,success:`
    <div id="success-screen" class="screen" role="main" aria-label="Успешное бронирование">
      <div class="success-circle" aria-hidden="true">✓</div>
      <h2 class="success-title">Бронирование подтверждено!</h2>
      <p class="success-subtitle">
        Твой NFT-билет создан на блокчейне TON.<br>
        Покажи QR-код на входе.
      </p>
      <div class="nft-ticket">
        <div class="ticket-header">
          <span class="ticket-label">NFT Билет</span>
          <span class="ticket-chain" aria-hidden="true">⛓️ TON</span>
        </div>
        <div class="ticket-title" id="ticket-title">Футбол с друзьями</div>
        <div class="ticket-meta">
          📍 Al Qudra, Dubai<br>
          🕖 Четверг, 19:00<br>
          💎 Оплачено: <span id="ticket-payment">25 USDT</span>
        </div>
        <div class="ticket-qr" aria-label="QR-код билета">
          <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
            <rect x="10" y="10" width="30" height="30" fill="black"/>
            <rect x="60" y="10" width="30" height="30" fill="black"/>
            <rect x="10" y="60" width="30" height="30" fill="black"/>
            <rect x="45" y="45" width="10" height="10" fill="black"/>
            <rect x="60" y="60" width="10" height="10" fill="black"/>
            <rect x="80" y="60" width="10" height="10" fill="black"/>
            <rect x="60" y="80" width="30" height="10" fill="black"/>
          </svg>
        </div>
      </div>
      <button class="btn btn-primary" data-action="navigate" data-screen="home" aria-label="На главную">
        🏠 На главную
      </button>
      <button class="btn btn-secondary" data-action="share-invite" aria-label="Пригласить друга">
        📤 Пригласить друга
      </button>
      <button class="btn btn-yandex" data-action="open-yandex" style="margin-top:12px;" aria-label="Построить маршрут">
        <span aria-hidden="true">🗺️</span> Построить маршрут
      </button>
    </div>
  `};function O(){let e=r.el(`app-frame`);e.appendChild(r.create(`div`,{id:`loading-overlay`,class:`loading-overlay`,role:`status`,"aria-live":`polite`},[r.create(`div`,{class:`spinner`,"aria-hidden":`true`}),r.create(`span`,{id:`loading-text`,style:`color:var(--tg-text-secondary); font-size:14px;`},[`Загрузка...`])])),e.appendChild(r.create(`button`,{id:`wallet-btn`,class:`wallet-connect-btn`,"aria-label":`Подключить кошелек TON`},[`💎 Подключить`])),Object.values(D).forEach(t=>{let n=document.createElement(`div`);n.innerHTML=t.trim(),e.appendChild(n.firstElementChild)}),e.appendChild(r.create(`nav`,{id:`bottom-nav`,class:`bottom-nav`,style:`display:none;`,role:`navigation`,"aria-label":`Главная навигация`},[r.create(`button`,{class:`nav-item active`,"data-action":`navigate`,"data-screen":`home`,"data-index":`0`,"aria-label":`Главная`,"aria-current":`page`},[r.create(`span`,{class:`nav-icon`,"aria-hidden":`true`},[`🏠`]),r.create(`span`,{class:`nav-label`},[`Главная`])]),r.create(`button`,{class:`nav-item`,"data-action":`navigate`,"data-screen":`friends`,"data-index":`1`,"aria-label":`Друзья`},[r.create(`span`,{class:`nav-icon`,"aria-hidden":`true`},[`👥`]),r.create(`span`,{class:`nav-label`},[`Друзья`])]),r.create(`button`,{class:`nav-item`,"data-action":`navigate`,"data-screen":`profile`,"data-index":`2`,"aria-label":`Профиль`},[r.create(`span`,{class:`nav-icon`,"aria-hidden":`true`},[`👤`]),r.create(`span`,{class:`nav-label`},[`Профиль`])])])),e.appendChild(r.create(`div`,{id:`toast`,class:`toast`,role:`status`,"aria-live":`polite`}))}function k(){let e=r.el(`app-frame`);e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action]`);if(!t)return;let r=t.dataset.action;n.haptic(`light`),A(r,t.dataset)}),e.addEventListener(`keydown`,e=>{if(e.key===`Enter`||e.key===` `){let t=e.target.closest(`[data-action]`);t&&(e.preventDefault(),A(t.dataset.action,t.dataset))}})}function A(r,i){switch(r){case`auth-telegram`:d();break;case`navigate`:c(i.screen),e.navigate(i.screen);break;case`open-activity`:_(i.id),e.navigate(`detail/`+i.id);break;case`go-back`:u();break;case`add-fav`:g(i.id,!0);break;case`remove-fav`:g(i.id,!1);break;case`clear-filter`:t.set(`activeFilter`,null),m();break;case`open-yandex`:v();break;case`filter-category`:t.set(`activeFilter`,i.cat),m(),n.haptic(`light`);break;case`share-link`:S();break;case`share-invite`:C();break;case`logout`:w();break;case`open-payment`:y(),e.navigate(`payment`);break;case`select-payment`:b(i.type);break;case`process-payment`:x();break}}e.on(`auth`,()=>c(`auth`)),e.on(`home`,()=>{c(`home`),l(0)}),e.on(`friends`,()=>{c(`friends`),l(1)}),e.on(`profile`,()=>{c(`profile`),l(2)}),e.on(`detail`,e=>_(e)),e.on(`success`,()=>c(`success`)),document.addEventListener(`DOMContentLoaded`,()=>{O(),k(),n.init(),i.init(),document.getElementById(`wallet-btn`).addEventListener(`click`,()=>i.connect()),n.tg?.BackButton&&n.tg.BackButton.onClick(()=>u()),s()||e.resolve()});
//# sourceMappingURL=index-BCMa-a49.js.map