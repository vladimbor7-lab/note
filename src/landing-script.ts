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
  
  (window as any).updR = function(el: HTMLInputElement) {
    const min = parseFloat(el.min);
    const max = parseFloat(el.max);
    const val = parseFloat(el.value);
    const p = ((val - min) / (max - min)) * 100;
    el.style.background = `linear-gradient(to right, #1d4ed8 ${p}%, #e2e8f0 ${p}%)`;
  };

  const obs = new IntersectionObserver(e => e.forEach(x => {
    if (x.isIntersecting) x.target.classList.add('in');
  }), { threshold: .08 });
  
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const TOURS: Record<string, any[]> = {
    'Турция': [
      {name:'Gloria Serenity Resort',loc:'Белек',stars:5,meal:'UI',price_base:82000,img:'#0d3b6e',desc:'Ultra inclusive · 7 ресторанов · аквапарк'},
      {name:'Rixos Premium Belek',loc:'Белек',stars:5,meal:'UI',price_base:95000,img:'#1a4a8a',desc:'Прямо на пляже · спа · детский клуб'},
      {name:'Calista Luxury Resort',loc:'Белек',stars:5,meal:'UI',price_base:105000,img:'#163d6b',desc:'Частный пляж · 9 бассейнов · спа'},
      {name:'Regnum Carya Golf',loc:'Белек',stars:5,meal:'UI',price_base:112000,img:'#1e5799',desc:'Гольф · 5 бассейнов · детский клуб'},
      {name:'Maxx Royal Belek',loc:'Белек',stars:5,meal:'UI',price_base:130000,img:'#0f3460',desc:'11 ресторанов · яхта · бутик-отель'},
      {name:'Kempinski Barbaros Bay',loc:'Бодрум',stars:5,meal:'HB',price_base:118000,img:'#1a3a5c',desc:'Вид на залив · бутик-отель · спа'},
      {name:'Limak Arcadia Resort',loc:'Белек',stars:5,meal:'UI',price_base:88000,img:'#14406a',desc:'Казино · аквапарк · 8 ресторанов'},
      {name:'Ali Bey Club Manavgat',loc:'Сиде',stars:4,meal:'AI',price_base:52000,img:'#1e5a8a',desc:'Большая территория · анимация · пляж'},
      {name:'Asteria Kremlin Palace',loc:'Анталья',stars:5,meal:'AI',price_base:58000,img:'#1a4870',desc:'Архитектура · всё включено · центр'},
      {name:'IC Hotels Santai',loc:'Белек',stars:5,meal:'UI',price_base:96000,img:'#0e3558',desc:'Семейный · аквапарк · 6 ресторанов'},
    ],
    'Египет': [
      {name:'Jaz Mirabel Beach',loc:'Шарм',stars:5,meal:'AI',price_base:44000,img:'#8b4513',desc:'Анимация · пляж · снорклинг'},
      {name:'Hilton Sharks Bay',loc:'Шарм',stars:4,meal:'AI',price_base:36000,img:'#9c6822',desc:'Удобное расположение · риф рядом'},
      {name:'Baron Palms Resort',loc:'Шарм',stars:5,meal:'AI',price_base:56000,img:'#7a3c10',desc:'Спокойный пляж · пальмы · спа'},
      {name:'Rixos Premium Sharm',loc:'Шарм',stars:5,meal:'UI',price_base:72000,img:'#6b2f0a',desc:'Лучший пляж · дайвинг · ultra inclusive'},
      {name:'Sharm Dreams Resort',loc:'Шарм',stars:4,meal:'AI',price_base:30000,img:'#a07028',desc:'Отличное соотношение цены и качества'},
      {name:'Gafy Resort',loc:'Шарм',stars:4,meal:'AI',price_base:26000,img:'#b08030',desc:'Бюджетный · пляж · анимация'},
      {name:'Titanic Palace Hurghada',loc:'Хургада',stars:5,meal:'AI',price_base:38000,img:'#8c5a1a',desc:'Большой отель · аквапарк · пляж'},
      {name:'SUNRISE Select Garden Beach',loc:'Хургада',stars:5,meal:'AI',price_base:42000,img:'#7a4e18',desc:'Сады · длинный пляж · семейный'},
    ],
    'ОАЭ': [
      {name:'Address Beach Resort',loc:'Дубай',stars:5,meal:'BB',price_base:88000,img:'#1a2a4a',desc:'Infinity pool · пляж Джумейра · спа'},
      {name:'Atlantis The Palm',loc:'Дубай',stars:5,meal:'BB',price_base:105000,img:'#2a4a7a',desc:'Аквапарк · 23 ресторана · приватный пляж'},
      {name:'Jumeirah Beach Hotel',loc:'Дубай',stars:5,meal:'BB',price_base:92000,img:'#1e3d6a',desc:'Волнообразная архитектура · пляж'},
      {name:'Bulgari Resort Dubai',loc:'Дубай',stars:5,meal:'BB',price_base:195000,img:'#0f1e3d',desc:'Самый эксклюзивный · марина · виллы'},
      {name:'W Dubai The Palm',loc:'Дубай',stars:5,meal:'BB',price_base:115000,img:'#253654',desc:'Дизайн · пляж Palm · DJ'},
      {name:'FIVE Palm Jumeirah',loc:'Дубай',stars:5,meal:'BB',price_base:98000,img:'#1c2d4a',desc:'Вечеринки · rooftop · панорама'},
    ],
    'Таиланд': [
      {name:'Dewa Phuket Resort',loc:'Пхукет',stars:4,meal:'BB',price_base:48000,img:'#164d32',desc:'Boutique · infinity pool · тропики'},
      {name:'Kata Palm Resort',loc:'Пхукет',stars:4,meal:'BB',price_base:55000,img:'#1e5a3a',desc:'500м до пляжа · тропический сад'},
      {name:'Anantara Mai Khao',loc:'Пхукет',stars:5,meal:'BB',price_base:85000,img:'#1a5c3a',desc:'Вилла с бассейном · тайский спа'},
      {name:'Trisara Phuket',loc:'Пхукет',stars:5,meal:'BB',price_base:145000,img:'#0f3d24',desc:'Приватные виллы · собственный пляж'},
      {name:'Avani+ Samui',loc:'Самуи',stars:5,meal:'BB',price_base:72000,img:'#1a4d2e',desc:'Бунгало · кокосовая роща · риф'},
      {name:'Zazen Boutique',loc:'Самуи',stars:4,meal:'BB',price_base:58000,img:'#1e5535',desc:'Романтик · йога · закаты'},
    ],
    'Греция': [
      {name:'Santorini Palace',loc:'Санторини',stars:4,meal:'BB',price_base:62000,img:'#3a6a9a',desc:'Вид на кальдеру · белоснежный стиль'},
      {name:'Canaves Oia Epitome',loc:'Санторини',stars:5,meal:'BB',price_base:165000,img:'#2a4a7a',desc:'Лучший закат · бутик · cave pool'},
      {name:'Domes of Elounda',loc:'Крит',stars:5,meal:'HB',price_base:95000,img:'#2a6a9a',desc:'Приватные купола · вид на море'},
      {name:'Crete Maris Beach',loc:'Крит',stars:5,meal:'AI',price_base:72000,img:'#3a7aaa',desc:'Семейный · аквапарк · длинный пляж'},
      {name:'Cavo Tagoo Mykonos',loc:'Миконос',stars:5,meal:'BB',price_base:142000,img:'#2a5a8a',desc:'Дизайн-отель · cave pool · закаты'},
      {name:'Grecotel Kos Imperial',loc:'Кос',stars:5,meal:'AI',price_base:68000,img:'#3a6888',desc:'Таласотерапия · спа · пляж'},
    ],
    'Мальдивы': [
      {name:'Sun Siyam Iru Veli',loc:'Атолл Дхаалу',stars:5,meal:'AI',price_base:115000,img:'#0a5a7a',desc:'Бунгало над водой · AI · снорклинг'},
      {name:'Velassaru Maldives',loc:'Атолл Мале',stars:5,meal:'HB',price_base:128000,img:'#0e7a9a',desc:'Вилла над водой · коралловый риф'},
      {name:'OZEN RESERVE Bolifushi',loc:'Атолл Мале',stars:5,meal:'UI',price_base:155000,img:'#086a8a',desc:'Ultra all-in · яхта · дайвинг'},
      {name:'Gili Lankanfushi',loc:'Атолл Мале',stars:5,meal:'FB',price_base:185000,img:'#065a78',desc:'Эко-люкс · бунгало-острова'},
      {name:'Conrad Maldives',loc:'Атолл Ари',stars:5,meal:'BB',price_base:175000,img:'#054d68',desc:'Подводный ресторан · 2 острова'},
      {name:'Soneva Jani',loc:'Атолл Ноону',stars:5,meal:'FB',price_base:220000,img:'#044560',desc:'Водяные горки в номере · обсерватория'},
    ],
  };

  const HOT_TOURS = [
    {name:'Limak Arcadia Resort',loc:'Белек, Турция',stars:5,meal:'UI',price_base:74000,original:95000,discount:22,operator:'Coral Travel',img:'#14406a',desc:'Аквапарк · казино · 8 ресторанов',hot:true},
    {name:'Jaz Mirabel Beach',loc:'Шарм, Египет',stars:5,meal:'AI',price_base:48000,original:68000,discount:29,operator:'Anex Tour',img:'#8b4513',desc:'Снорклинг · коралловый риф · анимация',hot:true},
    {name:'Asteria Kremlin Palace',loc:'Анталья, Турция',stars:5,meal:'AI',price_base:52000,original:72000,discount:28,operator:'Tez Tour',img:'#1a4870',desc:'Архитектура · всё включено · центр',hot:true},
  ];

  const D = { hist: [] as any[], busy: false };
  function fmt(t: string) { return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }

  function addMsg(text: string, isUser: boolean) {
    const feed = document.getElementById('dFeed');
    if (!feed) return;
    const row = document.createElement('div'); row.className = 'mr' + (isUser ? ' u' : '');
    const av = isUser ? '<div class="mav u">Вы</div>' : '<div class="mav b">✈</div>';
    row.innerHTML = isUser ? `<div class="bub">${fmt(text)}</div>` + av : av + `<div class="bub">${fmt(text)}</div>`;
    feed.appendChild(row); feed.scrollTop = feed.scrollHeight;
  }

  function renderCard(t: any, isHot = false) {
    const stars = '★'.repeat(t.stars);
    const discBadge = isHot && t.discount ? `<span class="tc-hot">–${t.discount}%</span>` : '';
    const oldPrice = isHot && t.original ? `<div class="tc-old">${t.original.toLocaleString('ru')} ₽</div>` : '';
    const op = t.operator ? `<div style="font-size:10px;color:var(--tx3);margin-bottom:4px;">${t.operator}</div>` : '';
    return `<div class="tour-card">
      <div class="tc-img" style="background:${t.img};">${discBadge}</div>
      <div class="tc-body">
        <div class="tc-name">${t.name}</div>
        <div class="tc-loc">${t.loc} · ${stars} · ${t.meal}</div>
        ${op}<div class="tc-desc">${t.desc}</div>
        <div class="tc-bot">
          <div class="tc-price">${t.price_base.toLocaleString('ru')} ₽<small>/чел</small>${oldPrice}</div>
          <div class="tc-stars">${stars}</div>
        </div>
        <button class="tc-btn" onclick="selectTour('${t.name}')">Выбрать</button>
      </div>
    </div>`;
  }

  function addTourCards(tours: any[], isHot = false) {
    const feed = document.getElementById('dFeed');
    if (!feed) return;
    const row = document.createElement('div'); row.className = 'mr';
    row.innerHTML = '<div class="mav b">✈</div><div style="display:flex;flex-direction:column;gap:8px;">' + tours.map(t => renderCard(t, isHot)).join('') + '</div>';
    feed.appendChild(row); feed.scrollTop = feed.scrollHeight;
  }

  (window as any).selectTour = function(name: string) {
    (window as any).dQuick(`Хочу тур в ${name}`);
  };

  function addTyping() {
    const feed = document.getElementById('dFeed');
    if (!feed) return;
    const r = document.createElement('div'); r.className = 'mr'; r.id = 'typing';
    r.innerHTML = '<div class="mav b">✈</div><div class="tbub"><div class="dots"><span></span><span></span><span></span></div></div>';
    feed.appendChild(r); feed.scrollTop = feed.scrollHeight;
  }
  function rmTyping() { document.getElementById('typing')?.remove(); }

  function setQR(btns: any[]) {
    const bar = document.getElementById('dQR');
    if (!bar) return;
    bar.innerHTML = '';
    btns.forEach(b => {
      const el = document.createElement('button'); el.className = 'qbtn'; el.textContent = b.l; el.onclick = b.f; bar.appendChild(el);
    });
  }

  (window as any).loadHotTours = async function() {
    const qr = document.getElementById('dQR');
    if (qr) qr.innerHTML = '';
    addMsg('Покажи горящие туры со скидками', true);
    D.hist.push({role:'user',content:'Покажи горящие туры со скидками'});
    await new Promise(r => setTimeout(r, 400));
    addTyping();
    await new Promise(r => setTimeout(r, 700));
    rmTyping();
    addMsg(`Горящие туры прямо сейчас — скидки до 31%:`, false);
    addTourCards(HOT_TOURS, true);
    setQR([
      {l:'Карточку менеджеру',f:()=>(window as any).dQuick('Оформи карточку клиента для менеджера')},
      {l:'Ещё горящие',f:()=>(window as any).dQuick('Есть ещё горящие туры?')},
      {l:'Подключить бот горящих',f:()=>(window as any).scrollContact('Hot Bot')},
    ]);
  };

  (window as any).doSearch = async function() {
    const country = (document.getElementById('fCountry') as HTMLSelectElement).value;
    const city = (document.getElementById('fCity') as HTMLSelectElement).value;
    const stars = parseInt((document.getElementById('fStars') as HTMLSelectElement).value);
    const nights = (document.getElementById('fNights') as HTMLSelectElement).value;
    const meal = (document.getElementById('fMeal') as HTMLSelectElement).value;
    const type = (document.getElementById('fType') as HTMLSelectElement).value;
    const budget = parseInt((document.getElementById('fBudget') as HTMLInputElement).value);
    const btn = document.getElementById('sbtn') as HTMLButtonElement;

    btn.disabled = true; btn.innerHTML = '<span class="sp"></span>Подбираем...';
    const qr = document.getElementById('dQR');
    if (qr) qr.innerHTML = '';

    const text = `Ищу тур: ${country}, из ${city}, ${type}, ${meal}, ${stars}★, ${nights} н., бюджет ${budget.toLocaleString('ru')} ₽ на двоих`;
    addMsg(text, true); D.hist.push({role:'user',content:text});

    await new Promise(r => setTimeout(r, 400)); addTyping();
    await new Promise(r => setTimeout(r, 800)); rmTyping();

    const available = (TOURS[country] || []).filter(t => t.price_base * 2 <= budget * 1.2).sort((a, b) => a.price_base - b.price_base);
    const cheapest = (TOURS[country] || []).sort((a, b) => a.price_base - b.price_base)[0];

    if (!available.length) {
      const min = cheapest ? cheapest.price_base * 2 : 0;
      addMsg(`В ${country} нет туров в бюджете ${budget.toLocaleString('ru')} ₽. Минимум от ${min.toLocaleString('ru')} ₽ на двоих.`, false);
      const sug = Math.ceil(min / 10000) * 10000;
      setQR([
        {l:`Бюджет ${sug.toLocaleString('ru')} ₽`,f:()=>{const b=document.getElementById('fBudget') as HTMLInputElement;b.value=sug.toString();const bval=document.getElementById('bval');if(bval)bval.textContent=Number(b.value).toLocaleString('ru')+' ₽';(window as any).updR(b);(window as any).doSearch();}},
        {l:'Смотреть 4★',f:()=>{const fs=document.getElementById('fStars') as HTMLSelectElement;if(fs)fs.value='4';(window as any).doSearch();}},
        {l:'Другая страна',f:()=>(window as any).dQuick('Что посоветуешь в этом бюджете?')},
      ]);
    } else {
      const n = available.length;
      addMsg(`Нашёл ${n} ${n === 1 ? 'вариант' : n < 5 ? 'варианта' : 'вариантов'} в ${country} в рамках бюджета:`, false);
      D.hist.push({role:'assistant',content:`Нашёл ${n} вариантов в ${country}`});
      addTourCards(available.slice(0, 3));
      setQR([
        {l:'Карточку менеджеру',f:()=>(window as any).dQuick('Оформи карточку клиента для менеджера')},
        {l:'Показать дешевле',f:()=>(window as any).dQuick('Есть варианты дешевле?')},
        {l:'Что входит в тур?',f:()=>(window as any).dQuick('Что входит в стоимость тура?')},
        {l:'Подключить на сайт',f:()=>(window as any).go('contact')},
      ]);
    }
    btn.disabled = false; btn.textContent = 'Подобрать туры';
  };

  (window as any).dSend = async function() {
    const inp = document.getElementById('dInp') as HTMLInputElement;
    if (!inp) return;
    const t = inp.value.trim();
    if (!t || D.busy) return; inp.value = '';
    addMsg(t, true); D.hist.push({role:'user',content:t});
    const qr = document.getElementById('dQR');
    if (qr) qr.innerHTML = '';
    await callDemo();
  };

  (window as any).dQuick = function(text: string) {
    const qr = document.getElementById('dQR');
    if (qr) qr.innerHTML = '';
    addMsg(text, true); D.hist.push({role:'user',content:text});
    callDemo();
  };

  async function callDemo() {
    if (D.busy) return; D.busy = true;
    await new Promise(r => setTimeout(r, 350)); addTyping();
    try {
      const res = await fetch(`${API}/api/demo/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: D.hist }) });
      await new Promise(r => setTimeout(r, 400));
      const data = await res.json(); rmTyping();
      if (data.reply) {
        addMsg(data.reply, false); D.hist.push({role:'assistant',content:data.reply});
        if (data.action === 'contact') { setTimeout(() => (window as any).go('contact'), 700); }
        else {
          setQR([
            {l:'Карточку менеджеру',f:()=>(window as any).dQuick('Оформи карточку клиента для менеджера')},
            {l:'Показать дешевле',f:()=>(window as any).dQuick('Есть варианты дешевле?')},
            {l:'Ближайшие даты',f:()=>(window as any).dQuick('Какие ближайшие даты вылета?')},
            {l:'Горящие туры',f:()=>(window as any).loadHotTours()},
            {l:'Подключить на сайт',f:()=>(window as any).go('contact')},
          ]);
        }
      } else { addMsg('Не нашёл вариантов. Попробуйте изменить параметры.', false); }
    } catch (e) {
      rmTyping();
      addMsg('Демо-сервер временно недоступен. Оставьте заявку — покажем вживую.', false);
      setQR([{l:'Оставить заявку',f:()=>(window as any).go('contact')}]);
    }
    D.busy = false;
  }

  (window as any).submitLead = async function() {
    const name = (document.getElementById('fName') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('fPhone') as HTMLInputElement).value.trim();
    const al = document.getElementById('fAlert');
    if (!name || !phone) {
      if (al) { al.textContent = 'Заполните название агентства и телефон'; al.style.display = 'block'; }
      return;
    }
    if (al) al.style.display = 'none';
    const btn = document.getElementById('fBtn') as HTMLButtonElement;
    btn.disabled = true; btn.innerHTML = '<span class="sp"></span>Отправляем...';
    try {
      await fetch(`${API}/api/demo/lead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          name, phone,
          contact: (document.getElementById('fContact') as HTMLInputElement).value,
          plan: (document.getElementById('fPlan') as HTMLSelectElement).value,
          site: (document.getElementById('fSite') as HTMLInputElement).value,
          team: (document.getElementById('fTeam') as HTMLSelectElement).value,
        })
      });
    } catch (e) {}
    const inner = document.getElementById('fInner');
    if (inner) inner.style.display = 'none';
    const success = document.getElementById('fSuccess');
    if (success) success.style.display = 'block';
  };

  // Initial messages
  const feed = document.getElementById('dFeed');
  if (feed && feed.children.length === 0) {
    addMsg('Выберите параметры и нажмите «Подобрать» — или посмотрите горящие туры.', false);
    setQR([
      {l:'Горящие туры',f:()=>(window as any).loadHotTours()},
      {l:'Турция 5★ 200 000 ₽',f:()=>{const b=document.getElementById('fBudget') as HTMLInputElement;if(b)b.value='200000';const bv=document.getElementById('bval');if(bv)bv.textContent='200 000 ₽';if(b)(window as any).updR(b);(window as any).doSearch();}},
      {l:'Египет 4★ 80 000 ₽',f:()=>{const c=document.getElementById('fCountry') as HTMLSelectElement;if(c)c.value='Египет';const s=document.getElementById('fStars') as HTMLSelectElement;if(s)s.value='4';const b=document.getElementById('fBudget') as HTMLInputElement;if(b)b.value='80000';const bv=document.getElementById('bval');if(bv)bv.textContent='80 000 ₽';if(b)(window as any).updR(b);(window as any).doSearch();}},
    ]);
  }
};
