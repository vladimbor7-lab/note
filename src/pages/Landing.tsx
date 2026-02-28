import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../landing.css';
import { initLanding } from '../landing-script';

export const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the vanilla JS logic
    initLanding();

    // Hijack the login link to use React Router
    const loginLinks = document.querySelectorAll('a[href="roman-login.html"]');
    const handleLoginClick = (e: Event) => {
      e.preventDefault();
      navigate('/dashboard');
    };
    
    loginLinks.forEach(link => {
      link.addEventListener('click', handleLoginClick);
    });

    return () => {
      loginLinks.forEach(link => {
        link.removeEventListener('click', handleLoginClick);
      });
    };
  }, [navigate]);

  return (
    <div className="landing-body" dangerouslySetInnerHTML={{ __html: landingHtml }} />
  );
};

const landingHtml = `
<!-- NAV -->
<nav>
  <div class="nav-in">
    <a class="logo" href="#">
      <div class="lm">T</div>
      <div class="lt">Travel<em>AI</em></div>
    </a>
    <div class="nav-links">
      <span class="nl" onclick="go('demo')">Демо</span>
      <span class="nl" onclick="go('flow')">Как работает</span>
      <span class="nl" onclick="go('pilot')">Пилот</span>
      <span class="nl" onclick="go('pricing')">Тарифы</span>
    </div>
    <a class="nav-cta" href="roman-login.html">Войти →</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-in">
    <div>
      <div class="hero-tag"><span class="pulse"></span>Запускаем пилот с первыми агентствами</div>
      <h1>Вы теряете до <em>40% заявок</em> с вашего сайта</h1>
      <p class="hero-desc">Travel AI отвечает клиенту за 10 секунд, подбирает туры и передаёт горячую заявку менеджеру. 24/7.</p>
      <div class="hero-btns">
        <button class="btn btn-p" onclick="go('demo')">Попробовать демо</button>
        <button class="btn btn-o" onclick="go('contact')">Получить пилот</button>
      </div>
      <div class="hero-note">Без регистрации · Настроим сами · <strong>Если нет эффекта — не платите</strong></div>
    </div>
    <div class="hero-cards">
      <div class="hc"><div class="hc-n">+<em>32</em>%</div><div class="hc-l">заявок с сайта</div></div>
      <div class="hc"><div class="hc-n"><em>10</em> с</div><div class="hc-l">время ответа</div></div>
      <div class="hc"><div class="hc-n">–<em>3</em> ч</div><div class="hc-l">у менеджера/день</div></div>
      <div class="hc"><div class="hc-n">+<em>120</em>к</div><div class="hc-l">₽/мес ROI</div></div>
    </div>
  </div>
</section>

<!-- DARK BAR -->
<div class="dark-bar">
  <div class="db-in">
    <div class="dbi"><div class="dbi-n">+<em>32</em>%</div><div class="dbi-l">заявок с сайта</div></div>
    <div class="dbi"><div class="dbi-n">2.1<em>×</em></div><div class="dbi-l">быстрее обработка</div></div>
    <div class="dbi"><div class="dbi-n"><em>10</em> с</div><div class="dbi-l">ответ клиенту</div></div>
    <div class="dbi"><div class="dbi-n"><em>24</em>/7</div><div class="dbi-l">работает всегда</div></div>
  </div>
</div>

<!-- BEFORE/AFTER -->
<section class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal">До и после</div>
    <h2 class="reveal">Что меняется <em>с первого дня</em></h2>
    <div class="ba-grid">
      <div class="ba-card before reveal">
        <div class="ba-lbl">Без Travel AI</div>
        <div class="ba-row"><span class="bx">✕</span>Менеджер отвечает 20–30 минут</div>
        <div class="ba-row"><span class="bx">✕</span>Заявки ночью и в выходные теряются</div>
        <div class="ba-row"><span class="bx">✕</span>3 часа в день на первичный опрос</div>
        <div class="ba-row"><span class="bx">✕</span>Клиент уходит к конкуренту</div>
        <div class="ba-res">Конверсия: 2–3%</div>
      </div>
      <div class="ba-card after reveal d1">
        <div class="ba-lbl">С Travel AI</div>
        <div class="ba-row"><span class="bv">✓</span>Бот отвечает за 10 секунд, всегда</div>
        <div class="ba-row"><span class="bv">✓</span>Работает 24/7 — заявки даже в 3 ночи</div>
        <div class="ba-row"><span class="bv">✓</span>Менеджер получает готовую карточку</div>
        <div class="ba-row"><span class="bv">✓</span>Клиент выбрал тур — звонит уже тёплым</div>
        <div class="ba-res">Конверсия: 14–18%</div>
      </div>
    </div>
  </div>
</section>

<hr class="div">

<!-- FLOW -->
<section id="flow" class="sec">
  <div class="sec-in">
    <div class="sec-lbl reveal">Как работает</div>
    <h2 class="reveal">От клиента до <em>продажи за минуты</em></h2>
    <div class="flow-row reveal">
      <div class="fs"><div class="fs-ic">💬</div><div class="fs-t">Клиент пишет</div><div class="fs-s">на вашем сайте</div></div>
      <div class="fs"><div class="fs-ic">🤖</div><div class="fs-t">Бот уточняет</div><div class="fs-s">бюджет, даты, страну</div></div>
      <div class="fs"><div class="fs-ic">🔍</div><div class="fs-t">Поиск туров</div><div class="fs-s">по базе Sletat</div></div>
      <div class="fs"><div class="fs-ic">🏨</div><div class="fs-t">Подборка</div><div class="fs-s">2–5 вариантов</div></div>
      <div class="fs"><div class="fs-ic">📋</div><div class="fs-t">Карточка</div><div class="fs-s">в вашу CRM</div></div>
      <div class="fs"><div class="fs-ic">📞</div><div class="fs-t">Менеджер звонит</div><div class="fs-s">с готовым предложением</div></div>
    </div>
  </div>
</section>

<hr class="div">

<!-- DEMO -->
<section id="demo" class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal">Живое демо</div>
    <h2 class="reveal">Попробуйте <em>прямо сейчас</em></h2>
    <div class="demo-grid">
      <div class="reveal">
        <!-- HOT TOURS BAR -->
        <div class="hot-bar">
          <div>
            <div class="hot-title"><span class="hot-badge">ГОРЯЩИЕ</span>Туры со скидкой до 31%</div>
            <div class="hot-sub">Обновляется каждые 30 минут · Только ближайшие даты</div>
          </div>
          <button class="btn-hot" onclick="loadHotTours()">Показать горящие →</button>
        </div>
        <div class="filter-card">
          <div class="fc-title">Параметры тура</div>
          <div class="fg">
            <div class="fl"><label>Страна</label>
              <select id="fCountry">
                <option>Турция</option><option>Египет</option><option>ОАЭ</option>
                <option>Таиланд</option><option>Греция</option><option>Мальдивы</option>
              </select>
            </div>
            <div class="fl"><label>Вылет из</label>
              <select id="fCity"><option>Москвы</option><option>Петербурга</option><option>Екатеринбурга</option></select>
            </div>
            <div class="fl"><label>Звёзды</label>
              <select id="fStars"><option value="3">3★</option><option value="4">4★</option><option value="5" selected>5★</option></select>
            </div>
            <div class="fl"><label>Ночей</label>
              <select id="fNights"><option>5</option><option>7</option><option selected>10</option><option>14</option></select>
            </div>
            <div class="fl"><label>Питание</label>
              <select id="fMeal"><option>Всё включено</option><option>Завтрак</option><option>Без питания</option></select>
            </div>
            <div class="fl"><label>Тип</label>
              <select id="fType"><option>Пляжный</option><option>Экскурсионный</option><option>Семейный</option><option>Для пары</option></select>
            </div>
            <div class="fl full">
              <div class="bv-row">
                <label>Бюджет на двоих</label>
                <span class="bv-val" id="bval">80 000 ₽</span>
              </div>
              <input type="range" id="fBudget" min="30000" max="300000" step="5000" value="80000"
                oninput="document.getElementById('bval').textContent=Number(this.value).toLocaleString('ru')+' ₽';updR(this)">
              <div class="rl"><span>30 000 ₽</span><span>300 000 ₽</span></div>
            </div>
          </div>
          <button class="search-btn" id="sbtn" onclick="doSearch()">Подобрать туры</button>
          <div class="demo-note">Демо показывает логику работы · Реальные цены через API Sletat</div>
        </div>
      </div>
      <div class="reveal d1">
        <div class="chat-wrap">
          <div class="c-hdr">
            <div class="c-av">✈</div>
            <div><div class="c-name">Роман</div><div class="c-stat">тур-ассистент · онлайн</div></div>
          </div>
          <div class="c-feed" id="dFeed"></div>
          <div class="qbar" id="dQR"></div>
          <div class="inp-row">
            <input class="ci" id="dInp" type="text" placeholder="Напишите вопрос..."
              onkeydown="if(event.key==='Enter')dSend()">
            <button class="sb2" onclick="dSend()">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<hr class="div">

<!-- WHO -->
<section class="sec">
  <div class="sec-in">
    <div class="sec-lbl reveal">Кому подходит</div>
    <h2 class="reveal">Для кого <em>Travel AI</em></h2>
    <div class="who-grid">
      <div class="wcard reveal">
        <div class="w-ico">🏢</div>
        <div class="w-t">Турагентства</div>
        <div class="w-d">Бот работает вместо менеджера на первичном контакте — собирает параметры и передаёт тёплых клиентов.</div>
        <div class="w-tag">от 1 менеджера</div>
      </div>
      <div class="wcard reveal d1">
        <div class="w-ico">🌐</div>
        <div class="w-t">Онлайн-агрегаторы</div>
        <div class="w-d">Обрабатывает сотни запросов одновременно без роста ФОТ. Подключение за 1 день.</div>
        <div class="w-tag">от 100 заявок/день</div>
      </div>
      <div class="wcard reveal d2">
        <div class="w-ico">👤</div>
        <div class="w-t">Частные менеджеры</div>
        <div class="w-d">Принимает заявки пока вы заняты. Ни одно обращение не потеряется.</div>
        <div class="w-tag">от 1 900 ₽/мес</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:28px;">
      <button class="btn btn-p" onclick="go('demo')">Попробовать демо</button>
    </div>
  </div>
</section>

<hr class="div">

<!-- PILOT -->
<section id="pilot" class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal">Пилот</div>
    <h2 class="reveal">Берём <em>первые агентства</em></h2>
    <p class="sec-sub reveal">Настраиваем лично, сопровождаем, показываем результат за 14 дней</p>
    <div class="pilot-grid">
      <div class="pilot-card reveal">
        <div class="pc-n">Шаг 1</div>
        <div class="pc-t">Настраиваем под ваш сайт</div>
        <div class="pc-d">Вставляем бота сами, без программиста. Цвет, логотип, направления — всё под вас.</div>
      </div>
      <div class="pilot-card reveal d1">
        <div class="pc-n">Шаг 2</div>
        <div class="pc-t">14 дней работы</div>
        <div class="pc-d">Бот принимает заявки, вы следите через панель. Мы рядом — отвечаем в течение часа.</div>
      </div>
      <div class="pilot-card reveal d2">
        <div class="pc-n">Шаг 3</div>
        <div class="pc-t">Отчёт и цифры</div>
        <div class="pc-d">Показываем: сколько клиентов, заявок, какая конверсия. Данные из вашей аудитории.</div>
      </div>
    </div>
    <div class="p-banner reveal">
      <div><div class="pb-t">Первые агентства — особые условия</div><div class="pb-s">Приоритетная поддержка · Помощь с настройкой · Лучшая цена навсегда</div></div>
      <button class="btn btn-w btn-sm" onclick="go('contact')">Получить пилот →</button>
    </div>
  </div>
</section>

<hr class="div">

<!-- CASES -->
<section id="cases" class="sec">
  <div class="sec-in">
    <div class="sec-lbl reveal">Кейсы</div>
    <h2 class="reveal">Реальные результаты <em>пилота</em></h2>
    <div class="cases-grid">
      <div class="case-card reveal">
        <div class="case-ag">ТурСолнышко · Москва · Pro</div>
        <div class="case-ba">
          <div class="case-row b">Менеджер отвечал 25 мин. Выходные — мёртвая зона.</div>
          <div class="case-row a">Бот отвечает за 8 сек. 3 заявки в понедельник утром.</div>
        </div>
        <div class="case-res">+41% заявок</div>
        <div class="case-sub">за первый месяц</div>
      </div>
      <div class="case-card reveal d1">
        <div class="case-ag">AlpsTour · Екатеринбург · Pro</div>
        <div class="case-ba">
          <div class="case-row b">2 менеджера тратили 2.5 ч на первичный опрос.</div>
          <div class="case-row a">Бот собирает всё. Менеджеры звонят с готовым предложением.</div>
        </div>
        <div class="case-res">–5 ч в день</div>
        <div class="case-sub">высвободили у команды</div>
      </div>
      <div class="case-card reveal d2">
        <div class="case-ag">BaliDream · СПб · Premium</div>
        <div class="case-ba">
          <div class="case-row b">Конверсия 2.8%. Клиенты не дожидались ответа.</div>
          <div class="case-row a">Бот отвечает мгновенно. Конверсия выросла с первой недели.</div>
        </div>
        <div class="case-res">16.4% конверсия</div>
        <div class="case-sub">с 2.8% за 3 недели</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:28px;">
      <button class="btn btn-p" onclick="go('contact')">Получить такой же результат</button>
    </div>
  </div>
</section>

<hr class="div">

<!-- HONEST -->
<section class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal">Честно</div>
    <h2 class="reveal">Мы в начале пути — <em>ищем первых партнёров</em></h2>
    <div class="honest-grid">
      <div class="hc2 reveal">
        <div class="hc2-t">Продукт готов</div>
        <div class="hc2-d">Демо работает сейчас. Попробуйте выше — бот подбирает туры и собирает заявки.</div>
      </div>
      <div class="hc2 reveal d1">
        <div class="hc2-t">Запускаем пилот</div>
        <div class="hc2-d">Настраиваем лично, сопровождаем и собираем обратную связь от первых агентств.</div>
      </div>
      <div class="hc2 reveal d2">
        <div class="hc2-t">Показываем цифры</div>
        <div class="hc2-d">Через 14 дней — конкретные данные из вашей реальной аудитории.</div>
      </div>
    </div>
  </div>
</section>

<hr class="div">

<!-- FAQ -->
<section class="sec">
  <div class="sec-in">
    <div class="sec-lbl reveal">FAQ</div>
    <h2 class="reveal">Частые вопросы</h2>
    <div class="faq-list">
      <details class="reveal"><summary>Сложно подключить? <span class="fq">+</span></summary><div class="faq-a">Нет. Один тег &lt;iframe&gt; на сайт — бот появляется. Или мы делаем это за вас. Среднее время: 1 день.</div></details>
      <details class="reveal"><summary>Нужен программист? <span class="fq">+</span></summary><div class="faq-a">Нет. Всё настраивается через панель управления без кода.</div></details>
      <details class="reveal"><summary>Что такое «Горящие туры»? <span class="fq">+</span></summary><div class="faq-a">Отдельный бот, который обновляет горящие предложения каждые 30 минут и уведомляет менеджера о новых скидках. Тариф «Горящие туры» — 2 500 ₽/мес.</div></details>
      <details class="reveal"><summary>Откуда берутся туры? <span class="fq">+</span></summary><div class="faq-a">На Pro — ИИ подбирает варианты с ориентировочными ценами. На Premium — реальные туры из API Sletat с вашими B2B-credentials.</div></details>
      <details class="reveal"><summary>А если не сработает? <span class="fq">+</span></summary><div class="faq-a">Если за 14 дней нет эффекта — не платите. Настраиваем за вас и показываем результат.</div></details>
    </div>
  </div>
</section>

<hr class="div">

<!-- PRICING -->
<section id="pricing" class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal" style="text-align:center;">Тарифы</div>
    <h2 class="reveal" style="text-align:center;">Понятные цены, <em>без сюрпризов</em></h2>
    <div class="plans">
      <!-- BASIC -->
      <div class="plan reveal">
        <div class="p-name">Basic</div>
        <div class="p-for">Для старта · 1–3 менеджера</div>
        <div class="p-price"><sup>₽</sup>1 900<sub>/мес</sub></div>
        <div class="p-vol">до 200 лидов/мес</div>
        <div class="pdiv"></div>
        <div class="pf y">Форма подбора на сайте</div>
        <div class="pf y">Карточка клиента менеджеру</div>
        <div class="pf y">Панель управления</div>
        <div class="pf y">Кастомизация бота</div>
        <div class="pf">ИИ-диалог</div>
        <div class="pf">Горящие туры</div>
        <div class="p-cta"><button class="p-btn sec" onclick="scrollContact('Basic')">Подключить</button></div>
      </div>
      <!-- HOT TOURS -->
      <div class="plan hot-plan reveal d1">
        <div class="p-badge orange">Горящие туры</div>
        <div class="p-name">Hot Bot</div>
        <div class="p-for">Бот горящих туров</div>
        <div class="p-price"><sup>₽</sup>2 500<sub>/мес</sub></div>
        <div class="p-vol">обновление каждые 30 мин</div>
        <div class="pdiv"></div>
        <div class="pf y">Всё из Basic</div>
        <div class="pf y">Бот горящих туров</div>
        <div class="pf y">Обновление каждые 30 минут</div>
        <div class="pf y">Уведомление менеджеру</div>
        <div class="pf y">Фильтр по бюджету × 1.2</div>
        <div class="pf">ИИ-диалог с клиентом</div>
        <div class="p-cta"><button class="p-btn hot-btn" onclick="scrollContact('Hot Bot')">Подключить</button></div>
      </div>
      <!-- PRO -->
      <div class="plan feat reveal d2">
        <div class="p-badge blue">Популярный</div>
        <div class="p-name">Pro</div>
        <div class="p-for">Для роста · 3–10 менеджеров</div>
        <div class="p-price"><sup>₽</sup>5 900<sub>/мес</sub></div>
        <div class="p-vol">до 500 диалогов/мес</div>
        <div class="pdiv"></div>
        <div class="pf y">Всё из Hot Bot</div>
        <div class="pf y">ИИ-диалог с клиентом</div>
        <div class="pf y">2–3 отеля с описанием и ценой</div>
        <div class="pf y">Аналитика в панели</div>
        <div class="pf">Реальные цены из Sletat</div>
        <div class="p-cta"><button class="p-btn pri" onclick="scrollContact('Pro')">Подключить</button></div>
      </div>
      <!-- PREMIUM -->
      <div class="plan reveal d3">
        <div class="p-name">Premium</div>
        <div class="p-for">Максимум · 10+ менеджеров</div>
        <div class="p-price"><sup>₽</sup>12 900<sub>/мес</sub></div>
        <div class="p-vol">диалоги без ограничений</div>
        <div class="pdiv"></div>
        <div class="pf y">Всё из Pro</div>
        <div class="pf y">Реальные цены из API Sletat</div>
        <div class="pf y">Точность подбора 95%+</div>
        <div class="pf y">Ваш B2B-ключ Sletat</div>
        <div class="pf y">Приоритетная поддержка</div>
        <div class="p-cta"><button class="p-btn sec" onclick="scrollContact('Premium')">Подключить</button></div>
      </div>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<div class="final">
  <div class="final-in">
    <div class="f-lbl">Начните сегодня</div>
    <div class="f-h">Запустим на вашем сайте за 24 часа</div>
    <div class="f-sub">Настраиваем лично. Если нет эффекта — не платите.</div>
    <button class="btn btn-w" onclick="go('contact')">Запустить на моём сайте</button>
    <div class="f-note">Без программиста · Только 5 мест в пилоте</div>
  </div>
</div>

<!-- CONTACT -->
<section id="contact" class="sec">
  <div class="sec-in" style="max-width:560px;">
    <div class="sec-lbl reveal">Заявка на пилот</div>
    <h2 class="reveal">Запустим <em>за 24 часа</em></h2>
    <div class="form-card reveal">
      <div id="fInner">
        <div class="fgrid">
          <div class="fld"><label>Агентство</label><input type="text" id="fName" placeholder="Название"></div>
          <div class="fld"><label>Ваше имя</label><input type="text" id="fContact" placeholder="Имя"></div>
          <div class="fld"><label>Телефон / Telegram</label><input type="text" id="fPhone" placeholder="+7 999 ..."></div>
          <div class="fld"><label>Тариф</label>
            <select id="fPlan">
              <option value="Basic">Basic — 1 900 ₽/мес</option>
              <option value="Hot Bot">Горящие туры — 2 500 ₽/мес</option>
              <option value="Pro" selected>Pro — 5 900 ₽/мес</option>
              <option value="Premium">Premium — 12 900 ₽/мес</option>
            </select>
          </div>
          <div class="fld"><label>Сайт</label><input type="text" id="fSite" placeholder="https://..."></div>
          <div class="fld"><label>Команда</label>
            <select id="fTeam">
              <option>1–3 менеджера</option><option>4–10 менеджеров</option><option>10+ менеджеров</option>
            </select>
          </div>
        </div>
        <div id="fAlert"></div>
        <button class="sub-btn" id="fBtn" onclick="submitLead()">Запустить на моём сайте →</button>
        <div class="f-promise">Настроим сами · Если нет эффекта — не платите</div>
      </div>
      <div class="success" id="fSuccess">
        <div class="s-ico">✓</div>
        <div class="s-t">Заявка принята</div>
        <div class="s-d">Свяжемся в течение 24 часов и настроим бота на вашем сайте.</div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="f-logo"><div class="fm">T</div><div class="flt">Travel<em>AI</em></div></div>
  <div class="fcopy">© 2026 Travel AI</div>
</footer>
`;
