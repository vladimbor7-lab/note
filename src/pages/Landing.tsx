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
      <span class="nl" onclick="go('demo')">Демо агента</span>
      <a class="nl" href="/chat" style="text-decoration:none; color:inherit;">Я турист</a>
      <span class="nl" onclick="go('features')">Возможности</span>
      <span class="nl" onclick="go('pricing')">Тарифы</span>
    </div>
    <a class="nav-cta" href="/dashboard">Войти (Агент) →</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-in">
    <div>
      <div class="hero-tag"><span class="pulse"></span>Твой второй мозг для продажи туров</div>
      <h1>Travel-консультант нового поколения. Продавайте туры, а не просто копируйте ссылки</h1>
      <p class="hero-desc">Интеграция с Отправкин.ру, интеллект Claude 3.5 и мгновенная упаковка в Telegram.</p>
      
      <!-- OTPROVIN DEMO FILTER -->
      <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-top: 30px; max-width: 500px;">
        <div style="display: flex; gap: 10px; margin-bottom: 15px; overflow-x: auto; padding-bottom: 5px;">
           <div style="background: #f1f5f9; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #475569; white-space: nowrap;">🇹🇷 Турция</div>
           <div style="background: #f1f5f9; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #475569; white-space: nowrap;">📅 15.09 - 25.09</div>
           <div style="background: #f1f5f9; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #475569; white-space: nowrap;">🌙 7-10 ночей</div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 5px;">
            <span>Бюджет</span>
            <span>до 250 000 ₽</span>
          </div>
          <div style="height: 6px; background: #e2e8f0; border-radius: 3px; position: relative;">
            <div style="position: absolute; left: 0; width: 70%; height: 100%; background: #3b82f6; border-radius: 3px;"></div>
            <div style="position: absolute; left: 70%; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: white; border: 2px solid #3b82f6; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
          </div>
        </div>
        <button class="btn btn-p" style="width: 100%; justify-content: center;" onclick="document.getElementById('demo-input').focus()">Найти и упаковать с ИИ</button>
      </div>

      <div class="hero-btns" style="margin-top: 30px;">
        <button class="btn btn-o" onclick="window.location.href='/chat'">Я турист (Бот)</button>
      </div>
      <div class="hero-note">Без регистрации · 3 генерации в день бесплатно</div>
    </div>
    <div class="hero-cards">
      <div class="hc"><div class="hc-n">Claude 3.5</div><div class="hc-l">пишет как человек</div></div>
      <div class="hc"><div class="hc-n">Otprovin</div><div class="hc-l">интеграция</div></div>
      <div class="hc"><div class="hc-n">WhatsApp</div><div class="hc-l">готовые посты</div></div>
    </div>
  </div>
</section>

<!-- DEMO INPUT -->
<section class="sec" style="padding: 40px 0;">
  <div class="sec-in">
    <div class="demo-input-wrap" style="max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
      <h3 style="text-align: center; margin-bottom: 20px; font-size: 24px;">Вставь ссылку на отель и посмотри, как я его упакую</h3>
      <div style="display: flex; gap: 10px;">
        <input type="text" id="demo-input" placeholder="Вставьте ссылку на отель (Booking, TopHotels, Sletat...)" style="flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 10px; font-size: 16px;">
        <button class="btn btn-p" onclick="alert('Это демо-поле. Для полной работы перейдите в Дашборд!')">Упаковать</button>
      </div>
    </div>
  </div>
</section>

<!-- COMPARISON -->
<section class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal">Сравнение</div>
    <h2 class="reveal">Почему Claude 3.5 <em>лучше ChatGPT</em></h2>
    <div class="ba-grid">
      <div class="ba-card before reveal">
        <div class="ba-lbl">Обычный AI (ChatGPT)</div>
        <div class="ba-text" style="font-size: 14px; line-height: 1.6; color: #555;">
          "Отель Rixos Premium Belek расположен в Белеке. В отеле есть бассейн, ресторан и спа. Номера оборудованы кондиционером. Пляж находится в 100 метрах. Хороший выбор для отдыха."
        </div>
        <div class="ba-res" style="color: #ef4444; background: #fee2e2;">Сухо и скучно</div>
      </div>
      <div class="ba-card after reveal d1">
        <div class="ba-lbl">Travel AI (Claude 3.5)</div>
        <div class="ba-text" style="font-size: 14px; line-height: 1.6; color: #111;">
          "✨ <b>Rixos Premium Belek — это не просто отель, это стиль жизни.</b><br><br>Представьте: вы просыпаетесь на вилле, а через 5 минут уже пьете кофе с видом на сосновый лес. Для детей — легендарный Land of Legends (бесплатно!), для вас — тишина в Anjana Spa.<br><br>🍸 <b>Фишка:</b> Здесь подают тот самый Godiva Chocolate в лобби. Идеально для тех, кто привык к люксу, но не хочет переплачивать за пафос."
        </div>
        <div class="ba-res">Продает эмоции</div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section id="features" class="sec">
  <div class="sec-in">
    <div class="sec-lbl reveal">Возможности</div>
    <h2 class="reveal">Киллер-фичи для <em>профи</em></h2>
    <div class="who-grid">
      <div class="wcard reveal">
        <div class="w-ico">🪄</div>
        <div class="w-t">Otprovin Connect</div>
        <div class="w-d">Вставьте ссылку — получите анализ. ИИ мгновенно изучит отели в вашей подборке и выделит главные аргументы для продажи.</div>
      </div>
      <div class="wcard reveal d1">
        <div class="w-ico">💬</div>
        <div class="w-t">Human Style</div>
        <div class="w-d">Никаких роботов. Claude 3.5 пишет так тепло и экспертно, что клиенты будут уверены: это написали вы лично.</div>
      </div>
      <div class="wcard reveal d2">
        <div class="w-ico">📱</div>
        <div class="w-t">WhatsApp Ready</div>
        <div class="w-d">Готовый оффер в один клик. Идеальное форматирование с эмодзи, которое читается на любом смартфоне.</div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="pricing" class="sec" style="background:var(--g);">
  <div class="sec-in">
    <div class="sec-lbl reveal" style="text-align:center;">Тарифы</div>
    <h2 class="reveal" style="text-align:center;">Стратегия <em>Low Entry — High Value</em></h2>
    <div class="plans">
      <!-- FREE -->
      <div class="plan reveal">
        <div class="p-name">Free (Trial)</div>
        <div class="p-for">Попробовать</div>
        <div class="p-price">0 <sup>₽</sup></div>
        <div class="p-vol">3 консультации/день</div>
        <div class="pdiv"></div>
        <div class="pf y">Базовая модель</div>
        <div class="pf y">Посты для соцсетей</div>
        <div class="pf">Анализ Отправкина</div>
        <div class="p-cta"><button class="p-btn sec" onclick="window.location.href='/dashboard'">Попробовать</button></div>
      </div>
      <!-- AGENT PRO -->
      <div class="plan hot-plan reveal d1">
        <div class="p-badge blue">Самый выгодный</div>
        <div class="p-name">Pro (Expert)</div>
        <div class="p-for">Основной продукт</div>
        <div class="p-price">1 990 <sup>₽</sup><sub>/мес</sub></div>
        <div class="p-vol">Безлимит</div>
        <div class="pdiv"></div>
        <div class="pf y"><b>Claude 3.5 Sonnet</b></div>
        <div class="pf y">Приоритетный анализ</div>
        <div class="pf y">Функция "Дожим клиента"</div>
        <div class="pf y">Кнопка "Реновация"</div>
        <div class="pf y">Стелс-режим</div>
        <div class="p-cta"><button class="p-btn pri" onclick="window.location.href='/dashboard'">Подключить</button></div>
      </div>
      <!-- AGENCY -->
      <div class="plan reveal d2">
        <div class="p-name">Agency (Team)</div>
        <div class="p-for">Команда / VIP</div>
        <div class="p-price">4 900 <sup>₽</sup><sub>/мес</sub></div>
        <div class="p-vol">До 3-х менеджеров</div>
        <div class="pdiv"></div>
        <div class="pf y">Всё из Pro</div>
        <div class="pf y">Общий архив подборок</div>
        <div class="pf y">Приоритетная поддержка</div>
        <div class="pf y">Обучение продажам через ИИ</div>
        <div class="p-cta"><button class="p-btn sec" onclick="window.location.href='/dashboard'">Подключить</button></div>
      </div>
    </div>
    <div style="text-align:center; margin-top: 20px; color: #666; font-size: 14px;">
      Оплата картой любого банка РФ (СБП)
    </div>
  </div>
</section>

<footer>
  <div class="f-logo"><div class="fm">T</div><div class="flt">Travel<em>AI</em></div></div>
  <div class="fcopy">© 2026 Travel AI · Интеграция с Отправкин.ру</div>
</footer>
`;
