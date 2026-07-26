(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const d of n)if(d.type==="childList")for(const c of d.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const d={};return n.integrity&&(d.integrity=n.integrity),n.referrerPolicy&&(d.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?d.credentials="include":n.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function i(n){if(n.ep)return;n.ep=!0;const d=a(n);fetch(n.href,d)}})();class S{constructor(){this.routes={},window.addEventListener("hashchange",()=>this.resolve()),window.addEventListener("popstate",()=>this.resolve())}on(t,a){this.routes[t]=a}navigate(t,a=!0){a?window.history.pushState(null,"","#"+t):window.location.hash=t,this.resolve()}resolve(){const t=window.location.hash.slice(1)||"auth",[a,i]=t.split("/");this.routes[a]&&this.routes[a](i)}back(){window.history.back()}}const p=new S;class U{constructor(t={}){this.state={...t},this.listeners=new Set}get(t){return this.state[t]}set(t,a){this.state[t]=a,this.notify(t,a)}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(t,a){this.listeners.forEach(i=>i(t,a))}}const r=new U({currentScreen:"auth",selectedActivity:null,selectedPayment:"usdt",user:null,wallet:null,history:[]});class D{constructor(){var t;this.tg=(t=window.Telegram)==null?void 0:t.WebApp,this.ready=!1}init(){var t;if(!this.tg){console.warn("Telegram WebApp not available");return}this.tg.ready(),this.tg.expand(),this.applyTheme(),this.setupViewport(),this.ready=!0,console.log("Telegram initData:",this.tg.initData),console.log("Telegram user:",(t=this.tg.initDataUnsafe)==null?void 0:t.user)}getInitData(){var t;return((t=this.tg)==null?void 0:t.initData)||""}getUser(){var t,a;return((a=(t=this.tg)==null?void 0:t.initDataUnsafe)==null?void 0:a.user)||null}applyTheme(){if(!this.tg)return;const t=this.tg.themeParams,a=document.documentElement;t.bg_color&&a.style.setProperty("--tg-theme-bg-color",t.bg_color),t.text_color&&a.style.setProperty("--tg-theme-text-color",t.text_color),t.hint_color&&a.style.setProperty("--tg-theme-hint-color",t.hint_color),t.button_color&&a.style.setProperty("--tg-theme-button-color",t.button_color),t.button_text_color&&a.style.setProperty("--tg-theme-button-text-color",t.button_text_color),t.secondary_bg_color&&a.style.setProperty("--tg-theme-secondary-bg-color",t.secondary_bg_color)}setupViewport(){var t,a;this.tg&&(this.tg.onEvent("viewportChanged",()=>{document.documentElement.style.setProperty("--safe-area-top",this.tg.viewportStableHeight+"px")}),this.tg.isExpanded&&((a=(t=this.tg).requestFullscreen)==null||a.call(t)))}haptic(t="light"){var a;(a=this.tg)!=null&&a.HapticFeedback&&this.tg.HapticFeedback.impactOccurred(t)}setHeaderColor(t){this.tg&&this.tg.setHeaderColor(t)}showBackButton(t){var a;(a=this.tg)!=null&&a.BackButton&&(t?this.tg.BackButton.show():this.tg.BackButton.hide())}setMainButton(t,a,i){var n;(n=this.tg)!=null&&n.MainButton&&(this.tg.MainButton.setText(t),a?this.tg.MainButton.show():this.tg.MainButton.hide(),this.tg.MainButton.onClick(i))}share(t,a){this.tg&&this.tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(t)}&text=${encodeURIComponent(a)}`)}close(){this.tg&&this.tg.close()}}const v=new D;class A{constructor(){this.connector=null,this.connected=!1,this.address=null}async init(){if(typeof TonConnectUI>"u"){console.warn("TON Connect UI not loaded");return}this.connector=new TonConnectUI({manifestUrl:"https://chili-app.pages.dev/tonconnect-manifest.json"}),this.connector.onStatusChange(t=>{var a;this.connected=!!t,this.address=((a=t==null?void 0:t.account)==null?void 0:a.address)||null,this.updateUI()})}updateUI(){const t=document.getElementById("wallet-btn");t&&(this.connected&&this.address?(t.textContent="💎 "+this.address.slice(0,6)+"..."+this.address.slice(-4),t.classList.add("connected"),t.setAttribute("aria-label","Кошелек подключен: "+this.address)):(t.textContent="💎 Подключить",t.classList.remove("connected"),t.setAttribute("aria-label","Подключить кошелек TON")),t.style.display="block")}async connect(){var t,a;if(!this.connector){(t=window.showToast)==null||t.call(window,"❌ TON Connect недоступен");return}try{await this.connector.connectWallet()}catch(i){console.error("TON Connect error:",i),(a=window.showToast)==null||a.call(window,"❌ Ошибка подключения кошелька")}}async sendTransaction(t,a,i){var n,d;if(!this.connector||!this.connected)return(n=window.showToast)==null||n.call(window,"❌ Сначала подключите кошелек"),null;try{return await this.connector.sendTransaction({validUntil:Math.floor(Date.now()/1e3)+600,messages:[{address:t,amount:String(a),payload:i||""}]})}catch(c){return console.error("Transaction error:",c),(d=window.showToast)==null||d.call(window,"❌ Транзакция отменена или не удалась"),null}}}const y=new A,s={el(e){return document.getElementById(e)},create(e,t={},a=[]){const i=document.createElement(e);return Object.entries(t).forEach(([n,d])=>{n==="text"?i.textContent=d:n==="html"?i.innerHTML=d:i.setAttribute(n,d)}),a.forEach(n=>{typeof n=="string"?i.appendChild(document.createTextNode(n)):i.appendChild(n)}),i},clear(e){for(;e.firstChild;)e.removeChild(e.firstChild)},show(e){e.style.display=""},hide(e){e.style.display="none"}};class L{constructor(t=""){this.baseURL=t,this.token=null}setToken(t){this.token=t}async request(t,a={}){const i=this.baseURL+t,n={"Content-Type":"application/json",...a.headers};this.token&&(n.Authorization=`Bearer ${this.token}`);try{const d=await fetch(i,{...a,headers:n});if(!d.ok){const c=await d.json().catch(()=>({}));throw new Error(c.error||`HTTP ${d.status}`)}return await d.json()}catch(d){throw console.error("API Error:",d),d}}async auth(t){const a=await this.request("/api/auth",{method:"POST",body:JSON.stringify({initData:t})});return this.setToken(a.token),a}async getActivities(){return this.request("/api/activities")}async getActivity(t){return this.request(`/api/activities/${t}`)}async createBooking(t,a){return this.request("/api/booking",{method:"POST",body:JSON.stringify({activityId:t,paymentType:a})})}}const b=new L(""),E={football:{emoji:"⚽",title:"Футбол с друзьями",price:"25 USDT",priceRaw:25,rubPrice:2250,rating:"4.8",desc:"Еженедельный футбол на отличном поле в Al Qudra. Все уровни приветствуются! После игры — социализация и крипто-обсуждения в ближайшем кафе.",location:"📍 Дубай, Al Qudra Sports Complex<br>🕖 Четверг, 19:00 — 21:00",address:"Al Qudra Sports Complex, Dubai",coords:"24.8466,55.3606",friends:[{avatar:"🧔",name:"Дмитрий",status:"✅ Идёт"},{avatar:"👱",name:"Сергей",status:"✅ Идёт"},{avatar:"🧑",name:"Артём",status:"🤔 Думает"}]},yoga:{emoji:"🧘‍♀️",title:"Утренняя йога в парке",price:"15 USDT",priceRaw:15,rubPrice:1350,rating:"4.9",desc:"Зарядка для тела и ума на свежем воздухе. Инструктор с 10-летним опытом. Маты предоставляются.",location:"📍 Стамбул, Парк Гези<br>🕖 Завтра, 8:00 — 9:30",address:"Taksim Gezi Parkı, Istanbul, Turkey",coords:"41.0378,28.9853",friends:[{avatar:"👩‍🦰",name:"Мария",status:"✅ Идёт"}]},quest:{emoji:"🗝️",title:"Квест «Побег из Алькатраса»",price:"40 USDT",priceRaw:40,rubPrice:3600,rating:"4.7",desc:"Иммерсивный квест с актёрами. Сложность: средняя. Для команд 2-6 человек.",location:"📍 Москва, Тверская 15<br>🕖 Суббота, 16:00 — 18:00",address:"Тверская улица, 15, Москва",coords:"55.7614,37.6041",friends:[]},nft:{emoji:"🎨",title:"Вебинар: NFT для начинающих",price:"Бесплатно",priceRaw:0,rubPrice:0,rating:"4.6",desc:"Разберём, как создать, продать и коллекционировать NFT. Спикер — основатель топовой коллекции.",location:"💻 Онлайн (Zoom)<br>🕖 Воскресенье, 15:00",address:null,coords:null,friends:[]},cs2:{emoji:"🎮",title:"CS2 Турнир «Crypto Cup»",price:"5 USDT",priceRaw:5,rubPrice:450,rating:"4.9",desc:"Еженедельный турнир по CS2 с призовым фондом в крипте. Формат: 5x5, BO1.",location:"💻 Онлайн (FaceIT)<br>🕖 Сегодня, 20:00",address:null,coords:null,friends:[{avatar:"🧑‍💻",name:"Иван",status:"✅ Играет"},{avatar:"👨‍🦱",name:"Павел",status:"✅ Играет"}]},wine:{emoji:"🍷",title:"Винная дегустация",price:"60 USDT",priceRaw:60,rubPrice:5400,rating:"4.8",desc:"Дегустация редких вин с сомелье. 6 позиций, сыры, хамон. Только для совершеннолетних.",location:"📍 Дубай, Dubai Marina<br>🕖 Суббота, 18:00 — 21:00",address:"Dubai Marina, Dubai, UAE",coords:"25.0772,55.1334",friends:[{avatar:"👱‍♀️",name:"Анна",status:"✅ Идёт"}]}},B="EQD...";function o(e){const t=r.get("history"),a=r.get("currentScreen");a&&a!==e&&t.push(a),r.set("history",t),r.set("currentScreen",e),document.querySelectorAll(".screen").forEach(h=>h.classList.remove("active"));const i=s.el(e+"-screen");i&&(i.classList.add("active"),i.scrollTop=0);const n=s.el("bottom-nav");["auth","success","payment","detail"].includes(e)?(n.style.display="none",v.showBackButton(e!=="auth")):(n.style.display="flex",v.showBackButton(!1));const c={home:0,friends:1,profile:2};c[e]!==void 0&&g(c[e])}function g(e){document.querySelectorAll(".nav-item").forEach((t,a)=>{t.classList.toggle("active",a===e),t.setAttribute("aria-current",a===e?"page":"false")})}function w(){const e=r.get("history");if(e.length>0){const t=e.pop();r.set("history",e),o(t)}else o("home"),g(0)}async function N(){var e;l("✈️ Авторизация через Telegram..."),u(!0);try{const t=v.getInitData();if(!t){if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"){console.warn("No initData, using mock auth on localhost"),await f();return}u(!1),l("❌ Откройте приложение внутри Telegram");return}const a=await b.auth(t),i=v.getUser();r.set("user",{name:(i==null?void 0:i.first_name)||"Пользователь",id:((e=i==null?void 0:i.id)==null?void 0:e.toString())||"tg_user",username:i==null?void 0:i.username}),u(!1),o("home"),g(0),l(`✅ Добро пожаловать, ${(i==null?void 0:i.first_name)||"друг"}!`),v.setMainButton("Забронировать",!1,()=>{})}catch(t){u(!1),console.error("Auth error:",t),l("❌ Ошибка авторизации: "+t.message),await f()}}async function f(){r.set("user",{name:"Савва",id:"tg_123"}),u(!1),o("home"),g(0),l("✅ Добро пожаловать!")}function P(){r.set("user",{name:"Гость",id:"guest"}),o("home"),g(0)}function k(e){const t=E[e];if(!t)return;r.set("selectedActivity",t),s.el("detail-emoji").textContent=t.emoji,s.el("detail-title").textContent=t.title,s.el("detail-rating").textContent=t.rating,s.el("detail-desc").textContent=t.desc,s.el("detail-location").innerHTML=t.location,s.el("detail-price").textContent=t.price,s.el("detail-fiat").textContent="≈ "+t.rubPrice.toLocaleString("ru-RU")+" ₽";const a=s.el("map-section");t.coords?(a.style.display="block",s.el("map-address").textContent=t.address):a.style.display="none";const i=s.el("detail-friends");if(s.clear(i),t.friends.length>0)t.friends.forEach(n=>{const d=s.create("div",{class:"detail-friend",role:"listitem"},[s.create("div",{class:"detail-friend-avatar","aria-hidden":"true"},[n.avatar]),s.create("div",{class:"detail-friend-name"},[n.name]),s.create("div",{class:"detail-friend-status"},[n.status])]);i.appendChild(d)});else{const n=s.create("div",{style:"color:var(--tg-text-secondary); font-size:14px;"},["Пока никто из друзей не идёт. Будь первым!"]);i.appendChild(n)}o("detail"),v.setMainButton("Забронировать",!0,()=>m())}function R(){const e=r.get("selectedActivity");if(!e||!e.coords){l("🗺️ Это онлайн-активность — маршрут не требуется");return}const t=`https://yandex.ru/maps/?rtext=~${e.coords}&rtt=auto`;window.open(t,"_blank","noopener,noreferrer"),l("🗺️ Яндекс Карты открыты в новой вкладке")}function m(){const e=r.get("selectedActivity");e&&(s.el("pay-activity").textContent=e.title,s.el("pay-price").textContent=e.price,T("usdt"),o("payment"),v.setMainButton("Оплатить",!0,()=>C()))}function T(e){r.set("selectedPayment",e),document.querySelectorAll(".payment-option").forEach(c=>{const h=c.dataset.type===e;c.classList.toggle("selected",h),c.setAttribute("aria-checked",h)});const t=r.get("selectedActivity");if(!t||t.priceRaw<=0){s.el("pay-total").textContent="Бесплатно",s.el("pay-fee").textContent="—",s.el("pay-conversion-row").style.display="none";return}const a=s.el("pay-conversion-row"),i=s.el("pay-fee"),n=s.el("pay-security");let d="";switch(e){case"usdt":d=t.priceRaw+.1+" USDT",i.textContent="~0.1 USDT",i.style.color="var(--tg-green)",a.style.display="none",n.textContent="🔒 Транзакция защищена смарт-контрактом TON";break;case"ton":d=(t.priceRaw/3.7).toFixed(2)+" TON",i.textContent="~0.05 TON",i.style.color="var(--tg-green)",a.style.display="none",n.textContent="🔒 Транзакция защищена смарт-контрактом TON";break;case"chili":d=(t.priceRaw*40).toFixed(0)+" $CHILI",i.textContent="Без комиссии",i.style.color="var(--tg-green)",a.style.display="none",n.textContent="🔒 Транзакция защищена смарт-контрактом TON";break;case"card_rub":d=t.rubPrice.toLocaleString("ru-RU")+" ₽",i.textContent="+2% комиссия банка",i.style.color="var(--tg-orange)",a.style.display="flex",s.el("pay-conversion").textContent=t.priceRaw+" USDT ≈ "+t.rubPrice.toLocaleString("ru-RU")+" ₽",n.textContent="🔒 Платёж обрабатывается банком-партнёром";break;case"card_usd":d="$"+t.priceRaw.toFixed(2),i.textContent="+3% международная комиссия",i.style.color="var(--tg-orange)",a.style.display="none",n.textContent="🔒 Платёж обрабатывается банком-партнёром";break;case"sbp":d=t.rubPrice.toLocaleString("ru-RU")+" ₽",i.textContent="Без комиссии",i.style.color="var(--tg-green)",a.style.display="flex",s.el("pay-conversion").textContent=t.priceRaw+" USDT ≈ "+t.rubPrice.toLocaleString("ru-RU")+" ₽",n.textContent="⚡ Мгновенный перевод через СБП";break}s.el("pay-total").textContent=d}async function C(){const e=r.get("selectedActivity"),t=r.get("selectedPayment");if(e){if(["usdt","ton","chili"].includes(t)&&y.connected){l("⏳ Отправка транзакции в блокчейн..."),u(!0);const a=Math.floor(t==="ton"?e.priceRaw/3.7*1e9:e.priceRaw*1e6),i=await y.sendTransaction(B,a);if(u(!1),!i)return}else if(["usdt","ton","chili"].includes(t)&&!y.connected){l("❌ Сначала подключите TON кошелек"),y.connect();return}else l("⏳ Подтверждение платежа..."),u(!0);try{const a=await b.createBooking(e.id,t);u(!1),s.el("ticket-title").textContent=e.title;let i=e.price;t==="card_rub"||t==="sbp"?i=e.rubPrice.toLocaleString("ru-RU")+" ₽":t==="card_usd"&&(i="$"+e.priceRaw),s.el("ticket-payment").textContent=i,o("success"),l("🎉 Бронирование подтверждено! NFT билет создан."),v.setMainButton("На главную",!0,()=>{o("home"),g(0)})}catch(a){u(!1),l("❌ Ошибка бронирования: "+a.message)}}}function O(e){l(`🔍 Фильтр: ${{sport:"Спорт",games:"Игры",edu:"Образование",fun:"Развлечения",food:"Еда",online:"Онлайн"}[e]||e}`)}function _(){var t;const e="https://t.me/chili_app_bot?start=ref_"+(((t=r.get("user"))==null?void 0:t.id)||"guest");navigator.clipboard?navigator.clipboard.writeText(e).then(()=>{l("🔗 Ссылка скопирована! Отправь другу в Telegram")}):v.share(e,"Присоединяйся к Chili!")}function z(){v.share("https://t.me/chili_app_bot","Я забронировал активность в Chili! Присоединяйся!"),l("📤 Приглашение отправлено в Telegram!")}function j(){r.set("user",null),r.set("wallet",null),r.set("history",[]),b.setToken(null),o("auth"),l("👋 Вы вышли из аккаунта")}function l(e){const t=s.el("toast");t.textContent=e,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),3e3)}function u(e){s.el("loading-overlay").classList.toggle("active",e)}window.showToast=l;const I={auth:`
    <div id="auth-screen" class="screen active" role="main" aria-label="Экран авторизации">
      <div class="logo-container">
        <span class="logo-emoji" aria-hidden="true">❄️</span>
      </div>
      <h1 class="auth-title">Chili</h1>
      <p class="auth-subtitle">Найди свой досуг. Оплати криптой или картой. Делай это с друзьями из Telegram.</p>
      <button class="btn btn-primary" data-action="auth-telegram" aria-label="Войти через Telegram">
        <span aria-hidden="true">✈️</span> Войти через Telegram
      </button>
      <button class="btn btn-secondary" data-action="skip-auth" aria-label="Продолжить как гость">
        Продолжить как гость
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
          <span class="feature-icon" aria-hidden="true">💳</span>
          <div class="feature-text">
            <strong>Оплата криптой или картой</strong>
            USDT, TON, $CHILI, а также банковская карта (RUB/USD)
          </div>
        </div>
      </div>
    </div>
  `,home:`
    <div id="home-screen" class="screen" role="main" aria-label="Главный экран">
      <div class="screen-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div class="header-title">Привет, Савва! 👋</div>
            <div class="header-subtitle">Чем займёмся сегодня?</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; background:var(--tg-surface); padding:8px 14px; border-radius:20px; border:1px solid var(--tg-border);">
            <span style="font-size:18px;" aria-hidden="true">💎</span>
            <span style="font-weight:700; font-size:15px;">1,240</span>
            <span style="font-size:12px; color:var(--tg-text-secondary);">$CHILI</span>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <span aria-hidden="true">🔥</span> Друзья занимаются
          <button class="section-link" data-action="navigate" data-screen="friends" aria-label="Показать всех друзей">Все</button>
        </div>
        <div class="friends-strip" role="list" aria-label="Друзья онлайн">
          <div class="friend-card" role="listitem">
            <div class="friend-badge">LIVE</div>
            <div class="friend-avatar" aria-hidden="true">🧑‍💻</div>
            <div class="friend-name">Иван П.</div>
            <div class="friend-activity">Играет в CS2 турнир<br><span style="color:var(--tg-blue-light)">сейчас</span></div>
            <button class="join-btn" data-action="open-activity" data-id="cs2" aria-label="Присоединиться к CS2 турниру">Присоединиться</button>
          </div>
          <div class="friend-card" role="listitem">
            <div class="friend-avatar" aria-hidden="true">👩‍🦰</div>
            <div class="friend-name">Мария К.</div>
            <div class="friend-activity">Йога в парке<br><span style="color:var(--tg-orange)">завтра 8:00</span></div>
            <button class="join-btn" data-action="open-activity" data-id="yoga" aria-label="Присоединиться к йоге">Присоединиться</button>
          </div>
          <div class="friend-card" role="listitem">
            <div class="friend-avatar" aria-hidden="true">🧔</div>
            <div class="friend-name">Дмитрий В.</div>
            <div class="friend-activity">Футбол<br><span style="color:var(--tg-green)">чт 19:00</span></div>
            <button class="join-btn" data-action="open-activity" data-id="football" aria-label="Присоединиться к футболу">Присоединиться</button>
          </div>
          <div class="friend-card" role="listitem">
            <div class="friend-avatar" aria-hidden="true">👱‍♀️</div>
            <div class="friend-name">Анна С.</div>
            <div class="friend-activity">Винная дегустация<br><span style="color:var(--tg-purple)">сб 18:00</span></div>
            <button class="join-btn" data-action="open-activity" data-id="wine" aria-label="Присоединиться к дегустации">Присоединиться</button>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title" aria-hidden="true">📂 Категории</div>
        <div class="categories-grid" role="list" aria-label="Категории активностей">
          <button class="category-item" data-action="filter-category" data-cat="sport" role="listitem" aria-label="Фильтр: Спорт">
            <div class="category-icon" aria-hidden="true">⚽</div>
            <div class="category-name">Спорт</div>
          </button>
          <button class="category-item" data-action="filter-category" data-cat="games" role="listitem" aria-label="Фильтр: Игры">
            <div class="category-icon" aria-hidden="true">🎮</div>
            <div class="category-name">Игры</div>
          </button>
          <button class="category-item" data-action="filter-category" data-cat="edu" role="listitem" aria-label="Фильтр: Образование">
            <div class="category-icon" aria-hidden="true">🎓</div>
            <div class="category-name">Образование</div>
          </button>
          <button class="category-item" data-action="filter-category" data-cat="fun" role="listitem" aria-label="Фильтр: Развлечения">
            <div class="category-icon" aria-hidden="true">🎭</div>
            <div class="category-name">Развлечения</div>
          </button>
          <button class="category-item" data-action="filter-category" data-cat="food" role="listitem" aria-label="Фильтр: Еда">
            <div class="category-icon" aria-hidden="true">🍷</div>
            <div class="category-name">Еда</div>
          </button>
          <button class="category-item" data-action="filter-category" data-cat="online" role="listitem" aria-label="Фильтр: Онлайн">
            <div class="category-icon" aria-hidden="true">💻</div>
            <div class="category-name">Онлайн</div>
          </button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <span aria-hidden="true">✨</span> Рекомендации
          <span class="tag tag-green" aria-label="Персональные рекомендации">🔥 Персонально</span>
        </div>
        <div class="activity-card" data-action="open-activity" data-id="football" tabindex="0" role="button" aria-label="Футбол с друзьями, 25 USDT">
          <div class="activity-image" style="background: linear-gradient(135deg, #1e5128, #4e9f3d);" aria-hidden="true">
            ⚽
            <div class="activity-price-tag">25 USDT</div>
          </div>
          <div class="activity-info">
            <div class="activity-title">Футбол с друзьями</div>
            <div class="activity-meta">
              <span>📍 Дубай, Al Qudra</span>
              <span>•</span>
              <span>чт 19:00</span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="tag" aria-label="Категория: Спорт">⚽ Спорт</span>
              <span class="tag tag-green" aria-label="Есть свободные места">👥 Есть места</span>
            </div>
            <div class="activity-friends">
              <div class="friend-avatars" aria-hidden="true">
                <div class="mini-avatar">🧔</div>
                <div class="mini-avatar">👱</div>
                <div class="mini-avatar">🧑</div>
              </div>
              <span class="activity-friends-text">Дмитрий и 2 друга идут</span>
            </div>
          </div>
        </div>
        <div class="activity-card" data-action="open-activity" data-id="yoga" tabindex="0" role="button" aria-label="Утренняя йога в парке, 15 USDT">
          <div class="activity-image" style="background: linear-gradient(135deg, #5e2d66, #9b59b6);" aria-hidden="true">
            🧘‍♀️
            <div class="activity-price-tag">15 USDT</div>
          </div>
          <div class="activity-info">
            <div class="activity-title">Утренняя йога в парке</div>
            <div class="activity-meta">
              <span>📍 Стамбул, Гези</span>
              <span>•</span>
              <span>завтра 8:00</span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="tag" aria-label="Категория: Спорт">🧘‍♀️ Спорт</span>
              <span class="tag tag-orange" aria-label="Утренняя активность">⏰ Утро</span>
            </div>
            <div class="activity-friends">
              <div class="friend-avatars" aria-hidden="true">
                <div class="mini-avatar">👩‍🦰</div>
              </div>
              <span class="activity-friends-text">Мария идёт — присоединяйся!</span>
            </div>
          </div>
        </div>
        <div class="activity-card" data-action="open-activity" data-id="quest" tabindex="0" role="button" aria-label="Квест Побег из Алькатраса, 40 USDT">
          <div class="activity-image" style="background: linear-gradient(135deg, #4a1c40, #8e44ad);" aria-hidden="true">
            🗝️
            <div class="activity-price-tag">40 USDT</div>
          </div>
          <div class="activity-info">
            <div class="activity-title">Квест «Побег из Алькатраса»</div>
            <div class="activity-meta">
              <span>📍 Москва, Тверская</span>
              <span>•</span>
              <span>сб 16:00</span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="tag" aria-label="Категория: Развлечения">🎭 Развлечения</span>
              <span class="tag tag-green" aria-label="Новая активность">🆕 Новое</span>
            </div>
          </div>
        </div>
        <div class="activity-card" data-action="open-activity" data-id="nft" tabindex="0" role="button" aria-label="Вебинар NFT для начинающих, Бесплатно">
          <div class="activity-image" style="background: linear-gradient(135deg, #1a1a2e, #16213e);" aria-hidden="true">
            🎨
            <div class="activity-price-tag">Бесплатно</div>
          </div>
          <div class="activity-info">
            <div class="activity-title">Вебинар: NFT для начинающих</div>
            <div class="activity-meta">
              <span>💻 Онлайн</span>
              <span>•</span>
              <span>вс 15:00</span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="tag" aria-label="Категория: Онлайн">💻 Онлайн</span>
              <span class="tag tag-green" aria-label="Категория: Образование">🎓 Образование</span>
            </div>
          </div>
        </div>
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
  `};function M(){const e=s.el("app-frame");e.appendChild(s.create("div",{id:"loading-overlay",class:"loading-overlay",role:"status","aria-live":"polite"},[s.create("div",{class:"spinner","aria-hidden":"true"}),s.create("span",{id:"loading-text",style:"color:var(--tg-text-secondary); font-size:14px;"},["Загрузка..."])])),e.appendChild(s.create("button",{id:"wallet-btn",class:"wallet-connect-btn","aria-label":"Подключить кошелек TON"},["💎 Подключить"])),Object.values(I).forEach(t=>{const a=document.createElement("div");a.innerHTML=t.trim(),e.appendChild(a.firstElementChild)}),e.appendChild(s.create("nav",{id:"bottom-nav",class:"bottom-nav",style:"display:none;",role:"navigation","aria-label":"Главная навигация"},[s.create("button",{class:"nav-item active","data-action":"navigate","data-screen":"home","data-index":"0","aria-label":"Главная","aria-current":"page"},[s.create("span",{class:"nav-icon","aria-hidden":"true"},["🏠"]),s.create("span",{class:"nav-label"},["Главная"])]),s.create("button",{class:"nav-item","data-action":"navigate","data-screen":"friends","data-index":"1","aria-label":"Друзья"},[s.create("span",{class:"nav-icon","aria-hidden":"true"},["👥"]),s.create("span",{class:"nav-label"},["Друзья"])]),s.create("button",{class:"nav-item","data-action":"navigate","data-screen":"profile","data-index":"2","aria-label":"Профиль"},[s.create("span",{class:"nav-icon","aria-hidden":"true"},["👤"]),s.create("span",{class:"nav-label"},["Профиль"])])])),e.appendChild(s.create("div",{id:"toast",class:"toast",role:"status","aria-live":"polite"}))}function F(){const e=s.el("app-frame");e.addEventListener("click",t=>{const a=t.target.closest("[data-action]");if(!a)return;const i=a.dataset.action;v.haptic("light"),x(i,a.dataset)}),e.addEventListener("keydown",t=>{if(t.key==="Enter"||t.key===" "){const a=t.target.closest("[data-action]");a&&(t.preventDefault(),x(a.dataset.action,a.dataset))}})}function x(e,t){switch(e){case"auth-telegram":N();break;case"skip-auth":P();break;case"navigate":o(t.screen),p.navigate(t.screen);break;case"open-activity":k(t.id),p.navigate("detail/"+t.id);break;case"go-back":w();break;case"open-payment":m(),p.navigate("payment");break;case"select-payment":T(t.type);break;case"process-payment":C();break;case"open-yandex":R();break;case"filter-category":O(t.cat);break;case"share-link":_();break;case"share-invite":z();break;case"logout":j();break}}"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(e=>console.log("SW registered:",e.scope)).catch(e=>console.error("SW registration failed:",e));p.on("auth",()=>o("auth"));p.on("home",()=>{o("home"),g(0)});p.on("friends",()=>{o("friends"),g(1)});p.on("profile",()=>{o("profile"),g(2)});p.on("detail",e=>k(e));p.on("payment",()=>m());p.on("success",()=>o("success"));document.addEventListener("DOMContentLoaded",()=>{var e;M(),F(),v.init(),y.init(),document.getElementById("wallet-btn").addEventListener("click",()=>y.connect()),(e=v.tg)!=null&&e.BackButton&&v.tg.BackButton.onClick(()=>w()),window.location.hash?p.resolve():o("auth")});
//# sourceMappingURL=index-BMiFwRDb.js.map
