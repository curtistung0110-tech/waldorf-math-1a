const EDITIONS = window.EDITIONS;
const art = window.art;
const NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const STAGES = { 經驗: 's1', 回想: 's2', 符號: 's3', 延伸: 's4', 課本: 's4' };

EDITIONS.forEach((ed) => {
  ed.subject = ed.subject || '數學';
  ed.units.forEach((u, i) => { u.ed = ed; u.idx = i; });
});
const SUBJECTS = [...new Set(EDITIONS.map((ed) => ed.subject))];
const ALL_UNITS = EDITIONS.flatMap((ed) => ed.units);
const findUnit = (id) => ALL_UNITS.find((u) => u.id === id);
const artKey = (u) => u.art || u.id;
const mark = (u) => u.mark || NUM[u.idx];
const unitLabel = (u) => u.label || `單元${NUM[u.idx]}`;
const bookName = (ed) => `${ed.subject}・${ed.name}`;

/* ---------- 儲存（只存在這台裝置的瀏覽器） ---------- */
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (_) { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* 無法儲存時照常使用 */ } }
};
const done = store.get('wm1a-done', {});
const doneCount = (u) => u.acts.filter((_, i) => done[u.id] && done[u.id][i]).length;
const dotClass = (u) => { const n = doneCount(u); return 'dot' + (n === 0 ? '' : n === u.acts.length ? ' all' : ' some'); };

let edition = EDITIONS.find((ed) => ed.id === store.get('wm1a-edition', '')) || EDITIONS[0];
function setEdition(ed) {
  edition = ed;
  store.set('wm1a-edition', ed.id);
}

/* ---------- 頁面 ---------- */
function editionSwitch() {
  return `<div class="book-switch">${SUBJECTS.map((subject) => `<div class="book-group"><span class="book-subject">${subject}</span><div class="edition-switch" role="group" aria-label="${subject}課本版本">${EDITIONS.filter((ed) => ed.subject === subject).map((ed) => `<button type="button" data-edition="${ed.id}" aria-pressed="${ed === edition}" aria-label="${bookName(ed)}">${ed.name}</button>`).join('')}</div></div>`).join('')}</div>`;
}

function progressHTML(u) {
  const n = doneCount(u), t = u.acts.length;
  return `<div class="progress"><div class="bar"><i style="width:${n / t * 100}%"></i></div><span>活動 ${n} / ${t}</span></div>`;
}

function home() {
  const last = findUnit(store.get('wm1a-last', ''));
  const first = edition.units[0];
  const actions = last
    ? `<a class="btn primary" href="#/${last.id}">繼續：${bookName(last.ed)} ${unitLabel(last)} ${last.title}</a><a class="btn" href="#/prep">開始之前</a>`
    : `<a class="btn primary" href="#/prep">從「開始之前」讀起</a><a class="btn" href="#/${first.id}">直接看${unitLabel(first)}</a>`;
  return `
  <section class="hero" id="top">
    <div class="hero-text">
      <span class="label">國小一年級上學期 · 數學、國語</span>
      <h1>華德福一上家學本</h1>
      <p class="lede">學校教符號和方法，家裡補上故事、身體和雙手的經驗。依照孩子的科目和課本版本排好單元，每個都有可以唸給孩子聽的故事、一週怎麼排、在家活動，以及怎麼接回課本。</p>
      <div class="edition-row"><span>孩子要學的是</span>${editionSwitch()}</div>
      <div class="actions">${actions}</div>
    </div>
    ${art('hero')}
  </section>

  <section class="home-section">
    <div class="notice col">請對照老師發的教學進度表，找到這週的單元。家裡的活動可以<strong>比學校早一週</strong>開始，孩子在學校看到符號和算式時，心裡已經有畫面。</div>
  </section>

  <section class="home-section">
    <h2>怎麼用這個網站</h2>
    <ol class="steps">
      <li><b>選科目和版本</b>選好孩子的課本，對照學校進度表，打開這週的單元。</li>
      <li><b>前一晚先讀故事</b>自己先唸一遍，想好要用哪些寶物。</li>
      <li><b>當天按「說故事」</b>大字一段一段翻，講完照一週安排做活動，做完打勾。</li>
    </ol>
  </section>

  <section class="home-section" id="units">
    <div class="sec-head"><h2>${bookName(edition)}</h2>${editionSwitch()}</div>
    ${edition.note ? `<p class="sec-note col">${edition.note}</p>` : ''}
    <div class="unit-grid">
      ${edition.units.map((u) => `<a class="ucard" href="#/${u.id}">${art(artKey(u))}<div class="ucard-body"><div class="ucard-title"><b>${mark(u)}</b><span>${u.title}</span></div><div class="ucard-secs">${u.secs.join('　')}</div>${progressHTML(u)}</div></a>`).join('')}
    </div>
  </section>

  <section class="home-section">
    <div class="pair">
      <a class="pcard" href="#/prep">${art('prep')}<div><h3>開始之前</h3><p>每天的節奏、要準備的寶物、數數詩</p></div></a>
      <a class="pcard" href="#/parents">${art('parents')}<div><h3>給爸媽的叮嚀</h3><p>在體制內與華德福之間，拿捏分寸的五件事</p></div></a>
    </div>
  </section>`;
}

function side(active, ed) {
  const cur = (id) => (active === id ? ' aria-current="page"' : '');
  return `<aside class="side" aria-label="單元目錄"><span class="label">目錄 · ${bookName(ed)}</span>
    <ol><li><a class="plain" href="#/prep"${cur('prep')}>開始之前</a></li></ol>
    <ol>${ed.units.map((u) => `<li><a href="#/${u.id}"${cur(u.id)}><b>${mark(u)}</b><span>${u.title}</span><span class="${dotClass(u)}" aria-hidden="true"></span></a></li>`).join('')}</ol>
    <ol><li><a class="plain" href="#/parents"${cur('parents')}>給爸媽的叮嚀</a></li></ol>
  </aside>`;
}

function unitTable(u) {
  if (u.table) return u.table;
  if (u.numbers) return { title: '十個數字的意象', head: ['數字', '意象', '在家找一找'], rows: u.numbers };
  return null;
}

function tableHTML(table) {
  return `<section class="sec"><h2>${table.title}</h2><div class="tablewrap"><table class="nums">
    <thead><tr>${table.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div></section>`;
}

function verseHTML(verse) {
  return `<section class="sec col">
    <div class="sec-head"><h2>唸唱歌謠</h2><span class="count">邊唸邊做動作</span></div>
    <div class="chant">
      <p class="chant-title">${verse.title}</p>
      ${verse.lines.map(([line, move]) => `<div class="chant-line"><span class="chant-text">${line}</span><span class="chant-move">${move}</span></div>`).join('')}
    </div>
    ${verse.note ? `<p class="sec-note">${verse.note}</p>` : ''}
  </section>`;
}

function unitPage(u) {
  const units = u.ed.units, i = u.idx, prev = units[i - 1], next = units[i + 1];
  const table = unitTable(u);
  return `<div class="page">${side(u.id, u.ed)}<article class="content">
    <div class="crumb"><a href="#/">首頁</a> ／ ${bookName(u.ed)} ／ ${unitLabel(u)}</div>
    ${art(artKey(u))}
    <header class="uhead"><span class="no">${mark(u)}</span><h1>${u.title}</h1><div class="chips">${u.secs.map((x) => `<span>${x}</span>`).join('')}</div></header>
    <p class="image-line col">核心意象：${u.image}</p>

    ${u.verse ? verseHTML(u.verse) : ''}

    <section class="sec col">
      <div class="sec-head"><h2>今天的故事</h2><button class="btn primary" type="button" data-story="${u.id}">${u.verse ? '唸歌謠、說故事' : '開始說故事'}</button></div>
      ${u.storyNote ? `<p class="sec-note">${u.storyNote}</p>` : ''}
      <div class="story">
        ${u.story.map((t) => `<p>${t}</p>`).join('')}
        <p class="ask"><strong>講完可以問孩子：</strong>${u.ask}</p>
      </div>
    </section>

    ${table ? tableHTML(table) : ''}

    <section class="sec col">
      <h2>一週怎麼排</h2>
      <ol class="week">${u.week.map((w, d) => `<li><span class="day">第 ${d + 1} 天</span><span class="stage ${STAGES[w[0]]}">${w[0]}</span><span>${w[1]}</span></li>`).join('')}</ol>
    </section>

    <section class="sec col">
      <div class="sec-head"><h2>在家活動</h2><span class="count" data-count="${u.id}">已做 ${doneCount(u)} / ${u.acts.length}</span></div>
      <ul class="checklist">${u.acts.map((a, k) => `<li><label><input type="checkbox" data-unit="${u.id}" data-idx="${k}"${done[u.id] && done[u.id][k] ? ' checked' : ''}><span><span class="act-t">${a[0]}</span>　${a[1]}</span></label></li>`).join('')}</ul>
    </section>

    <div class="two col">
      <div class="panel"><span class="label">主課本畫什麼</span><p>${u.book}</p></div>
      <div class="panel"><span class="label">這個單元要準備</span><ul>${u.mats.map((m) => `<li>${m}</li>`).join('')}</ul></div>
    </div>

    <section class="bridge col">
      <span class="label">接回課本</span>
      <ul>${u.bridge.map((b) => `<li>${b}</li>`).join('')}</ul>
      <p class="watch"><strong>常見錯誤：</strong>${u.watch}</p>
    </section>

    <nav class="pager col" aria-label="上一個與下一個單元">
      ${prev ? `<a href="#/${prev.id}"><span>上一個</span><b>${mark(prev)}　${prev.title}</b></a>` : `<a href="#/prep"><span>上一頁</span><b>開始之前</b></a>`}
      ${next ? `<a class="next" href="#/${next.id}"><span>下一個</span><b>${mark(next)}　${next.title}</b></a>` : `<a class="next" href="#/parents"><span>下一頁</span><b>給爸媽的叮嚀</b></a>`}
    </nav>
  </article></div>`;
}

function prepPage() {
  const first = edition.units[0];
  return `<div class="page">${side('prep', edition)}<article class="content">
    <div class="crumb"><a href="#/">首頁</a> ／ 開始之前</div>
    ${art('prep')}
    <header class="col"><h1 class="page-title">開始之前</h1></header>

    <section class="sec col">
      <h2>數學的每日節奏（約 20 分鐘）</h2>
      <ol class="rhythm">
        <li><span class="min">3 分</span><span><strong>律動：</strong>站起來邊拍手、踏步，邊唸數數詩</span></li>
        <li><span class="min">3 分</span><span><strong>回顧：</strong>請孩子把昨天的故事說給你聽</span></li>
        <li><span class="min">7 分</span><span><strong>新內容：</strong>講故事，用寶物籃演出來</span></li>
        <li><span class="min">5 分</span><span><strong>畫：</strong>把今天的故事畫進主課本</span></li>
        <li><span class="min">2 分</span><span><strong>結束：</strong>把寶物收回籃子，說一句固定的結束語</span></li>
      </ol>
    </section>

    <section class="sec col">
      <h2>國語的每日節奏（約 20 分鐘）</h2>
      <ol class="rhythm">
        <li><span class="min">3 分</span><span><strong>律動：</strong>拍手唸這一課的歌謠，邊唸邊做動作</span></li>
        <li><span class="min">3 分</span><span><strong>回顧：</strong>請孩子把昨天的故事說給你聽</span></li>
        <li><span class="min">7 分</span><span><strong>新內容：</strong>講符號或生字的故事，用身體扮出它的樣子</span></li>
        <li><span class="min">5 分</span><span><strong>畫與寫：</strong>先畫圖，再從圖裡寫出符號或字</span></li>
        <li><span class="min">2 分</span><span><strong>結束：</strong>在空中大大地寫一次今天的字</span></li>
      </ol>
    </section>

    <section class="sec col">
      <h2>三個階段：睡一覺再往下走</h2>
      <div class="three">
        <div><b>經驗</b>聽故事、用手和身體玩，還不寫</div>
        <div><b>回想</b>孩子說故事、畫進主課本</div>
        <div><b>符號</b>寫成數字、注音或國字，對照課本</div>
      </div>
      <p class="sec-note">每個單元的「一週怎麼排」都照這三個階段安排，另外加上延伸遊戲和課本練習。</p>
    </section>

    <section class="sec col">
      <h2>數數詩</h2>
      <div class="verse">
        <span>一是太陽照大地，</span><span>六角蜂巢藏蜂蜜，</span>
        <span>二是雙手拍一拍，</span><span>七色彩虹掛天邊，</span>
        <span>三腳板凳站得穩，</span><span>八隻腳的小章魚，</span>
        <span>四季輪流轉一圈，</span><span>九顆星星眨眼睛，</span>
        <span>五根手指張開來，</span><span>十根手指都到齊。</span>
      </div>
    </section>

    <div class="two col">
      <div class="panel"><span class="label">整學期的寶物籃</span><ul>
        <li>栗子或小石頭 30 顆</li><li>一塊布、一個可倒扣的杯子</li><li>小布袋、兩個小籃子</li><li>毛線一球、麻繩、小樹枝 30 根</li><li>蜂蠟或黏土、沙盤</li><li>紙盤和兩腳釘</li></ul></div>
      <div class="panel"><span class="label">主課本</span><p>一本無格線的大畫冊，搭配塊狀蜂蠟筆。數學和國語可以各用一本，每個故事畫一頁，一學期下來，就是孩子自己寫的書。</p></div>
    </div>

    <nav class="pager col"><a class="next" href="#/${first.id}"><span>下一頁 · ${bookName(edition)}</span><b>${mark(first)}　${first.title}</b></a></nav>
  </article></div>`;
}

function parentsPage() {
  const last = edition.units[edition.units.length - 1];
  return `<div class="page">${side('parents', edition)}<article class="content">
    <div class="crumb"><a href="#/">首頁</a> ／ 給爸媽的叮嚀</div>
    ${art('parents')}
    <header class="col"><h1 class="page-title">給爸媽的叮嚀</h1></header>
    <ul class="tips col">
      <li><b>學校的習作照常寫</b>家裡的故事是打底，不是取代。孩子仍然需要熟悉考卷的問法。</li>
      <li><b>別在故事裡糾正孩子</b>孩子數錯、寫錯時，請孩子用寶物再演一次、用身體再扮一次，讓孩子自己發現。</li>
      <li><b>學校教什麼方法，就把故事接過去</b>不要另外教一套，讓孩子兩邊打架。</li>
      <li><b>看孩子的精神</b>剛從華德福幼兒園進到體制內，第一學期光是坐著寫字就很累。累的時候，只做律動和說故事就好。</li>
      <li><b>跟著季節走</b>一上剛好是秋天到冬天，栗子、橡實、落葉、準備過年，都是現成的教材。</li>
    </ul>
    <p class="source col">數學單元名稱參考均一教育平台「類翰林版」「類南一版」一年級數學；國語課次與生字參考教育雲「生字詞彙表」南一版一年級上學期。出版社每年可能微調，請以孩子手上的課本為準。國語課文受著作權保護，本站不收錄課文。</p>
    <nav class="pager col"><a href="#/${last.id}"><span>上一個 · ${bookName(edition)}</span><b>${mark(last)}　${last.title}</b></a></nav>
  </article></div>`;
}

/* ---------- 路由 ---------- */
const app = document.getElementById('app');

function render() {
  const route = (location.hash || '#/').replace(/^#\/?/, '');
  let nav = 'home';
  if (route === 'prep') { app.innerHTML = prepPage(); nav = 'prep'; }
  else if (route === 'parents') { app.innerHTML = parentsPage(); nav = 'parents'; }
  else {
    const u = findUnit(route);
    if (u) {
      setEdition(u.ed);
      store.set('wm1a-last', u.id);
      app.innerHTML = unitPage(u);
      nav = 'units';
    } else {
      app.innerHTML = home();
      nav = route === 'units' ? 'units' : 'home';
    }
  }
  document.querySelectorAll('.topnav a').forEach((a) => {
    if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const units = route === 'units' && document.getElementById('units');
  if (units) units.scrollIntoView();
  else window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);

app.addEventListener('change', (ev) => {
  const t = ev.target;
  if (!t.matches('input[data-unit]')) return;
  const id = t.dataset.unit;
  done[id] = done[id] || {};
  done[id][t.dataset.idx] = t.checked;
  store.set('wm1a-done', done);
  const u = findUnit(id);
  const count = app.querySelector(`[data-count="${id}"]`);
  if (count) count.textContent = `已做 ${doneCount(u)} / ${u.acts.length}`;
  const dot = app.querySelector(`.side a[href="#/${id}"] .dot`);
  if (dot) dot.className = dotClass(u);
});

app.addEventListener('click', (ev) => {
  const edBtn = ev.target.closest('[data-edition]');
  if (edBtn) {
    const ed = EDITIONS.find((x) => x.id === edBtn.dataset.edition);
    if (!ed || ed === edition) return;
    const section = edBtn.closest('section');
    const sectionId = section ? section.id : '';
    const y = window.scrollY;
    setEdition(ed);
    app.innerHTML = home();
    window.scrollTo(0, y);
    const again = sectionId && app.querySelector(`#${sectionId} [data-edition="${ed.id}"]`);
    if (again) again.focus();
    return;
  }
  const btn = ev.target.closest('[data-story]');
  if (btn) openStory(btn.dataset.story, btn);
});

/* ---------- 說故事模式 ---------- */
const sm = document.getElementById('storymode');
let smUnit = null, smIdx = 0, smReturn = null;

function openStory(id, btn) {
  smUnit = findUnit(id);
  smIdx = 0;
  smReturn = btn;
  sm.hidden = false;
  document.body.style.overflow = 'hidden';
  drawStory();
}

function closeStory() {
  sm.hidden = true;
  document.body.style.overflow = '';
  if (smReturn) smReturn.focus();
}

// 說故事模式的頁面：有歌謠的單元先唸歌謠，再講故事，最後是提問。
function storySlides(u) {
  return [
    ...(u.verse ? [{ type: 'verse' }] : []),
    ...u.story.map((text) => ({ type: 'story', text })),
    { type: 'ask' }
  ];
}

function drawStory() {
  const u = smUnit, slides = storySlides(u), total = slides.length, last = smIdx === total - 1, slide = slides[smIdx];
  let body;
  if (slide.type === 'verse') body = `<div class="sm-ask"><span class="label">先一起唸：${u.verse.title}</span><p class="sm-text sm-verse">${u.verse.lines.map(([line]) => line).join('<br>')}</p></div>`;
  else if (slide.type === 'ask') body = `<div class="sm-ask"><span class="label">講完可以問孩子</span><p class="sm-text">${u.ask}</p></div>`;
  else body = `<p class="sm-text">${slide.text}</p>`;
  sm.innerHTML = `<div class="sm-top"><span class="label">${bookName(u.ed)} · ${unitLabel(u)} · ${u.title} · 說故事</span><button class="btn" type="button" data-s="close">結束</button></div>
    <div class="sm-body" data-s="next">${art(artKey(u))}${body}</div>
    <div class="sm-bottom">
      <button class="btn" type="button" data-s="prev"${smIdx === 0 ? ' disabled' : ''}>← 上一段</button>
      <div><div class="sm-dots" aria-hidden="true">${Array.from({ length: total }, (_, k) => `<i class="${k === smIdx ? 'on' : ''}"></i>`).join('')}</div><p class="sm-hint">點畫面或按 → 翻頁</p></div>
      <button class="btn primary" type="button" data-s="${last ? 'close' : 'next'}">${last ? '講完了' : '下一段 →'}</button>
    </div>`;
  const primary = sm.querySelector('.sm-bottom .btn.primary');
  if (primary) primary.focus();
}

function step(delta) {
  const total = storySlides(smUnit).length, nextIdx = smIdx + delta;
  if (nextIdx < 0 || nextIdx >= total) return;
  smIdx = nextIdx;
  drawStory();
}

sm.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-s]');
  if (!t) return;
  if (t.dataset.s === 'close') closeStory();
  else if (t.dataset.s === 'next') step(1);
  else if (t.dataset.s === 'prev') step(-1);
});

document.addEventListener('keydown', (ev) => {
  if (sm.hidden) return;
  if (ev.key === 'Escape') closeStory();
  else if (ev.key === 'ArrowRight') step(1);
  else if (ev.key === 'ArrowLeft') step(-1);
});

render();
