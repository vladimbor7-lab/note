export const initLanding = () => {
  const API = 'https://roman-backend-production.up.railway.app';
  
  (window as any).go = function(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  (window as any).scrollContact = function(plan: string) {
    const el = document.getElementById('fPlan') as HTMLSelectElement;
    if (el) el.value = plan;
    (window as any).go('contact');
  };

  const obs = new IntersectionObserver(e => e.forEach(x => {
    if (x.isIntersecting) x.target.classList.add('in');
  }), { threshold: .08 });
  
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const D = { hist: [] as any[], busy: false };
  function fmt(t: string) { return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }

  function addMsg(text: string, isUser: boolean) {
    const feed = document.getElementById('dFeed');
    if (!feed) return;
    const row = document.createElement('div'); row.className = 'mr' + (isUser ? ' u' : '');
    const av = isUser ? '<div class="mav u">Вы</div>' : '<div class="mav b">AI</div>';
    row.innerHTML = isUser ? `<div class="bub">${fmt(text)}</div>` + av : av + `<div class="bub">${fmt(text)}</div>`;
    feed.appendChild(row); feed.scrollTop = feed.scrollHeight;
  }

  function addTyping() {
    const feed = document.getElementById('dFeed');
    if (!feed) return;
    const r = document.createElement('div'); r.className = 'mr'; r.id = 'typing';
    r.innerHTML = '<div class="mav b">AI</div><div class="tbub"><div class="dots"><span></span><span></span><span></span></div></div>';
    feed.appendChild(r); feed.scrollTop = feed.scrollHeight;
  }
  function rmTyping() { document.getElementById('typing')?.remove(); }

  (window as any).doDemoGen = async function() {
    const link = (document.getElementById('dInpLink') as HTMLInputElement).value;
    const platform = (document.getElementById('fPlatform') as HTMLSelectElement).value;
    const btn = document.getElementById('sbtn') as HTMLButtonElement;

    if (!link) {
      alert('Пожалуйста, вставьте ссылку на отель или подборку');
      return;
    }

    btn.disabled = true; btn.innerHTML = '<span class="sp"></span>Анализирую...';
    
    addMsg(`Сделай пост для ${platform} по этой ссылке: ${link}`, true);
    
    await new Promise(r => setTimeout(r, 600));
    addTyping();
    
    // Simulation of analysis
    await new Promise(r => setTimeout(r, 1500));
    rmTyping();
    addMsg(`Вижу отель! 🏨 <strong>Rixos Premium Belek</strong>.\nАнализирую отзывы и фото...`, false);
    
    await new Promise(r => setTimeout(r, 800));
    addTyping();
    
    await new Promise(r => setTimeout(r, 2000));
    rmTyping();

    let resultText = "";
    if (platform.includes("WhatsApp")) {
      resultText = `🔥 *Rixos Premium Belek — Роскошь, которую вы заслужили!* 🔥\n\nТуристы в восторге от:\n✅ Пляжа с мальдивским песком\n✅ Подогреваемых бассейнов (+29°C!)\n✅ Кухни: 7 ресторанов, стейки и морепродукты — топ!\n\n✈️ Вылет 15.10 на 7 ночей\n💰 Цена: 245 000 ₽ на двоих\n\nБронируем? Места уходят быстро! 👇`;
    } else if (platform.includes("Telegram")) {
      resultText = `🇹🇷 **Rixos Premium Belek: Когда отдых — это искусство**\n\nКоллеги, нашла для вас настоящий бриллиант в Белеке. Это не просто отель, это уровень God-mode для ваших туристов.\n\n**Почему именно он?**\n💎 **Пляж:** 700 метров чистого песка, пологий вход. Идеально для детей.\n💎 **Еда:** Это гастрономический оргазм. Стейк-хаус, итальянец, рыбный — всё включено и всё на высшем уровне.\n💎 **Зимой и летом:** Открытый подогреваемый бассейн спасает в любой сезон.\n\n**Кому предлагать?**\nВзыскательным парам и семьям, которые привыкли к лучшему сервису.\n\n✈️ *Вылет из Москвы 15 октября*\n🌙 *7 ночей, Ultra All Inclusive*\n🔥 **245 000 ₽ за двоих**\n\nПишите в лс, рассчитаю на ваш состав! @travel_agent`;
    } else {
      resultText = `🌴 **Rixos Premium Belek** 🌴\n\nПредставьте: вы просыпаетесь под шум прибоя, завтракаете свежайшими круассанами, а впереди — день полного релакса.\n\n✨ Почему Rixos?\n• Премиум сервис 24/7\n• Шикарный SPA-центр\n• Концерты звезд по вечерам\n\nХотите сюда? Ставьте + в комментарии, пришлю расчет! 👇\n\n#турция #rixos #отдых #море`;
    }

    addMsg(resultText, false);
    btn.disabled = false; btn.textContent = 'Сгенерировать описание';
  };

  (window as any).submitLead = async function() {
    const name = (document.getElementById('fName') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('fPhone') as HTMLInputElement).value.trim();
    const al = document.getElementById('fAlert');
    
    if (!name || !phone) {
      if (al) { al.textContent = 'Заполните имя и телефон'; al.style.display = 'block'; }
      return;
    }
    if (al) al.style.display = 'none';
    
    const btn = document.getElementById('fBtn') as HTMLButtonElement;
    btn.disabled = true; btn.innerHTML = '<span class="sp"></span>Отправляем...';
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    const inner = document.getElementById('fInner');
    if (inner) inner.style.display = 'none';
    const success = document.getElementById('fSuccess');
    if (success) success.style.display = 'block';
  };

  // Initial greeting
  const feed = document.getElementById('dFeed');
  if (feed && feed.children.length === 0) {
    addMsg('Привет! Я AITravel. Вставьте ссылку на отель с Отправкин.ру, и я напишу продающий текст.', false);
  }
};
