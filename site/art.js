// 水彩濕畫法風格的插畫：用 SVG 基本形狀加上水彩濾鏡（邊緣暈開、顏料顆粒、紙紋）。
(function () {
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <filter id="wc" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1000" height="650" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="1.3" result="b"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" result="n2"/>
      <feColorMatrix in="n2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 1.25" result="tex"/>
      <feComposite in="b" in2="tex" operator="in"/>
    </filter>
    <filter id="veil" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1000" height="650" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="14"/>
    </filter>
    <filter id="grain" filterUnits="userSpaceOnUse" x="0" y="0" width="800" height="450">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="9"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .47  0 0 0 0 .36  0 0 0 -1.6 .95"/>
    </filter>
  </defs></svg>`;
  document.body.insertAdjacentHTML('afterbegin', DEFS);

  const C = { paper: '#FBF6EA', gold: '#EDB63F', lemon: '#F2D86A', carmine: '#C24760', verm: '#E0703F', rose: '#E9A3A2', ultra: '#4B64B0', prus: '#2E6B80', sky: '#9CC3D5', leaf: '#86A85C', moss: '#56804A', brown: '#8A5A36', ochre: '#CC9A4B', violet: '#8C6BAA', skin: '#EFC4A0', beard: '#EFE9DE', grey: '#8E97A6' };

  const c = (x, y, r, col, o = .85, cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity="${o}"${cls ? ` class="${cls}"` : ''}/>`;
  const e = (x, y, rx, ry, col, o = .85, rot = 0) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" fill-opacity="${o}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}/>`;
  const p = (d, col, o = .85, cls = '') => `<path d="${d}" fill="${col}" fill-opacity="${o}"${cls ? ` class="${cls}"` : ''}/>`;
  const s = (d, col, w, o = .85) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity="${o}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const r = (x, y, w, h, col, o = .85, rot = 0, cls = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${col}" fill-opacity="${o}"${rot ? ` transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"` : ''}${cls ? ` class="${cls}"` : ''}/>`;
  const hill = (y, a, col, o = .8) => p(`M-60 ${y} C 120 ${y - a} 280 ${y + a * .4} 420 ${y - a * .5} S 700 ${y - a * 1.1} 860 ${y - a * .3} L 860 520 L -60 520 Z`, col, o);
  const frame = (bg, fg, label) => `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><rect width="800" height="450" fill="${C.paper}"/><g filter="url(#veil)">${bg}</g><g filter="url(#wc)">${fg}</g><rect class="grain" width="800" height="450" filter="url(#grain)"/></svg>`;

  function robe(x, y, k, w, h, col) {
    return p(`M${x - w * k} ${y} C ${x - w * k} ${y - h * .6 * k} ${x - w * .5 * k} ${y - h * k} ${x} ${y - h * k} C ${x + w * .5 * k} ${y - h * k} ${x + w * k} ${y - h * .6 * k} ${x + w * k} ${y} Z`, col, .88);
  }
  function gnome(x, y, k, hat, body, o = {}) {
    const w = o.plump ? 52 : o.thin ? 22 : 34, h = o.thin ? 140 : o.plump ? 100 : 118, hy = y - h * k - 8 * k;
    let out = '';
    if (o.bag) out += e(x + (w + 8) * k, y - 30 * k, 19 * k, 23 * k, C.ochre, .9);
    out += robe(x, y, k, w, h, body);
    out += c(x, hy, 15 * k, C.skin, .95);
    out += p(`M${x - 13 * k} ${hy + 2 * k} Q ${x} ${hy + 50 * k} ${x + 13 * k} ${hy + 2 * k} Z`, C.beard, 1, 'nb');
    out += c(x, hy + 2 * k, 4 * k, C.rose, .95, 'nb');
    out += p(`M${x - 19 * k} ${hy - 3 * k} Q ${x - 4 * k} ${hy - 50 * k} ${x + 18 * k} ${hy - 80 * k} Q ${x + 10 * k} ${hy - 40 * k} ${x + 19 * k} ${hy - 3 * k} Z`, hat, .92);
    return out;
  }
  const crown = (x, hy, k) => p(`M${x - 16 * k} ${hy - 8 * k} L ${x - 16 * k} ${hy - 32 * k} L ${x - 8 * k} ${hy - 20 * k} L ${x} ${hy - 38 * k} L ${x + 8 * k} ${hy - 20 * k} L ${x + 16 * k} ${hy - 32 * k} L ${x + 16 * k} ${hy - 8 * k} Z`, C.gold, .95);
  function king(x, y, k) { const hy = y - 138 * k; return robe(x, y, k, 50, 130, C.carmine) + c(x, hy, 16 * k, C.skin, .95) + p(`M${x - 14 * k} ${hy + 2 * k} Q ${x} ${hy + 64 * k} ${x + 14 * k} ${hy + 2 * k} Z`, C.beard, 1, 'nb') + crown(x, hy, k); }
  function prince(x, y, k, col) { const hy = y - 103 * k; return robe(x, y, k, 30, 95, col) + c(x, hy, 15 * k, C.skin, .95) + crown(x, hy, k * .75); }
  const acorn = (x, y, k = 1) => e(x, y, 8 * k, 10 * k, C.brown, .88) + p(`M${x - 9 * k} ${y - 4 * k} Q ${x} ${y - 17 * k} ${x + 9 * k} ${y - 4 * k} Z`, C.ochre, .95) + s(`M${x} ${y - 13 * k} l 2 -5`, C.brown, 2);
  const chestnut = (x, y, k = 1) => p(`M${x - 10 * k} ${y + 6 * k} Q ${x - 11 * k} ${y - 8 * k} ${x} ${y - 12 * k} Q ${x + 11 * k} ${y - 8 * k} ${x + 10 * k} ${y + 6 * k} Q ${x} ${y + 10 * k} ${x - 10 * k} ${y + 6 * k} Z`, C.brown, .9) + e(x, y + 5 * k, 7 * k, 3 * k, C.ochre, .6);
  const gem = (x, y, k, col) => p(`M${x} ${y - 12 * k} L ${x + 10 * k} ${y - 2 * k} L ${x} ${y + 12 * k} L ${x - 10 * k} ${y - 2 * k} Z`, col, .92);
  const tree = (x, y, k, cols) => s(`M${x} ${y} Q ${x - 6 * k} ${y - 80 * k} ${x + 4 * k} ${y - 150 * k}`, C.brown, 22 * k, .9) + c(x - 50 * k, y - 170 * k, 60 * k, cols[0], .7) + c(x + 40 * k, y - 190 * k, 70 * k, cols[1], .7) + c(x, y - 240 * k, 60 * k, cols[2], .7);
  function snake(x0, y, len, col, w) { let d = `M${x0} ${y}`; const seg = len / 4; for (let i = 0; i < 4; i++) d += ` q ${seg / 2} ${i % 2 ? 16 : -16} ${seg} 0`; return s(d, col, w, .85) + e(x0 + len + 10, y, w * .8, w * .62, col, .9) + c(x0 + len + 16, y - 4, 3, C.prus, .9); }
  const owl = (x, y, k = 1) => e(x, y, 30 * k, 40 * k, C.ochre) + e(x - 22 * k, y + 6 * k, 11 * k, 27 * k, C.brown, .7, 15) + e(x + 22 * k, y + 6 * k, 11 * k, 27 * k, C.brown, .7, -15) + p(`M${x - 24 * k} ${y - 30 * k} l 4 -18 l 10 12 Z M${x + 24 * k} ${y - 30 * k} l -4 -18 l -10 12 Z`, C.brown) + c(x - 12 * k, y - 16 * k, 10 * k, C.lemon, .95, 'nb') + c(x + 12 * k, y - 16 * k, 10 * k, C.lemon, .95, 'nb') + c(x - 12 * k, y - 16 * k, 4 * k, C.prus, .95, 'nb') + c(x + 12 * k, y - 16 * k, 4 * k, C.prus, .95, 'nb') + p(`M${x - 5 * k} ${y - 6 * k} L ${x + 5 * k} ${y - 6 * k} L ${x} ${y + 4 * k} Z`, C.verm, .95);
  const rabbit = (x, y, k, col) => e(x + 12 * k, y - 76 * k, 5 * k, 20 * k, col, .85, -10) + e(x + 24 * k, y - 74 * k, 5 * k, 20 * k, col, .85, 12) + e(x, y - 22 * k, 24 * k, 22 * k, col) + c(x + 18 * k, y - 48 * k, 15 * k, col) + c(x - 24 * k, y - 26 * k, 7 * k, C.beard, 1, 'nb');
  const turtle = (x, y, k) => c(x + 36 * k, y - 10 * k, 9 * k, C.leaf) + p(`M${x - 32 * k} ${y} Q ${x} ${y - 54 * k} ${x + 32 * k} ${y} Z`, C.moss, .9);
  const hedgehog = (x, y, k) => e(x + 28 * k, y - 9 * k, 11 * k, 8 * k, C.skin, .95) + p(`M${x - 30 * k} ${y} L ${x - 28 * k} ${y - 18 * k} L ${x - 20 * k} ${y - 14 * k} L ${x - 18 * k} ${y - 30 * k} L ${x - 8 * k} ${y - 22 * k} L ${x - 2 * k} ${y - 36 * k} L ${x + 6 * k} ${y - 24 * k} L ${x + 14 * k} ${y - 32 * k} L ${x + 18 * k} ${y - 18 * k} L ${x + 26 * k} ${y - 10 * k} L ${x + 24 * k} ${y} Z`, C.brown, .9);
  const fox = (x, y, k) => s(`M${x - 24 * k} ${y - 18 * k} q -30 -4 -32 -30`, C.verm, 14 * k, .8) + e(x, y - 20 * k, 26 * k, 18 * k, C.verm) + p(`M${x + 12 * k} ${y - 42 * k} L ${x + 48 * k} ${y - 26 * k} L ${x + 18 * k} ${y - 14 * k} Z M${x + 14 * k} ${y - 40 * k} l 3 -18 l 11 13 Z`, C.verm, .9);
  const bear = (x, y, k) => c(x - 2 * k, y - 82 * k, 7 * k, C.brown) + c(x + 22 * k, y - 82 * k, 7 * k, C.brown) + e(x, y - 30 * k, 32 * k, 30 * k, C.brown) + c(x + 10 * k, y - 66 * k, 18 * k, C.brown, .9);
  const squirrel = (x, y, k) => s(`M${x - 10 * k} ${y - 10 * k} C ${x - 60 * k} ${y - 20 * k} ${x - 70 * k} ${y - 110 * k} ${x - 25 * k} ${y - 120 * k} C ${x + 5 * k} ${y - 126 * k} ${x + 2 * k} ${y - 90 * k} ${x - 20 * k} ${y - 92 * k}`, C.verm, 24 * k, .72) + e(x + 6 * k, y - 28 * k, 20 * k, 28 * k, C.verm, .88) + c(x + 18 * k, y - 62 * k, 14 * k, C.verm, .9) + p(`M${x + 12 * k} ${y - 72 * k} l 2 -14 l 8 10 Z`, C.verm) + c(x + 24 * k, y - 64 * k, 2.5 * k, C.prus, .95, 'nb');
  const leafBundle = (x, y, k = 1) => p(`M${x - 36 * k} ${y} Q ${x} ${y - 40 * k} ${x + 36 * k} ${y} Q ${x} ${y + 30 * k} ${x - 36 * k} ${y} Z`, C.moss, .88) + s(`M${x} ${y - 22 * k} L ${x} ${y + 16 * k}`, C.ochre, 4 * k, .95);
  const leaf = (x, y, k, col, rot) => `<g transform="rotate(${rot} ${x} ${y})">${p(`M${x - 14 * k} ${y} Q ${x} ${y - 12 * k} ${x + 14 * k} ${y} Q ${x} ${y + 12 * k} ${x - 14 * k} ${y} Z`, col, .85)}</g>`;
  function star(cx, cy, R, rr) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? rr : R; d += (i ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; }
  const GEMS = [C.carmine, C.ultra, C.gold, C.violet, C.prus, C.leaf, C.verm];

  const SCENES = {
    hero: () => frame(
      r(-40, -40, 880, 280, C.lemon, .55) + e(620, 110, 170, 130, C.gold, .45) + e(200, 260, 430, 90, C.rose, .3) + hill(270, 50, C.ultra, .45) + hill(310, 40, C.prus, .3),
      c(620, 110, 52, C.gold, .9) + hill(345, 40, C.leaf, .75) + hill(392, 28, C.ochre, .8) + tree(250, 400, 1, [C.verm, C.gold, C.carmine]) + acorn(430, 405) + acorn(470, 414) + acorn(506, 402) + chestnut(560, 412) + chestnut(596, 420, .9),
      '秋天的山丘、橡樹與橡實'),
    prep: () => frame(
      r(-40, -40, 880, 520, '#F3D98F', .35) + e(400, 120, 380, 140, C.rose, .25),
      r(-20, 300, 840, 200, C.ochre, .5) + c(90, 372, 34, C.carmine, .8) + s('M64 362 Q 90 342 118 364', C.rose, 4) + s('M66 384 Q 92 364 120 386', C.rose, 4) + s('M120 392 q 60 30 110 12', C.carmine, 4, .8)
      + chestnut(180, 300) + chestnut(215, 290) + chestnut(250, 298) + chestnut(285, 292) + chestnut(232, 312) + p('M140 305 Q 230 410 320 305 Z', C.brown, .88) + s('M162 328 Q 230 358 298 328', C.ochre, 4, .7)
      + p('M390 350 Q 465 330 540 350 L 540 250 Q 465 232 390 250 Z', '#FFFDF6', 1, 'nb') + p('M540 350 Q 615 330 690 350 L 690 250 Q 615 232 540 250 Z', '#FFFDF6', 1, 'nb') + c(462, 295, 28, C.gold, .8) + s('M565 305 q 20 -30 40 0 t 40 0', C.ultra, 6, .8)
      + r(705, 338, 58, 22, C.carmine, .92, -15) + r(690, 382, 58, 22, C.ultra, .92, 10) + r(590, 388, 58, 22, C.gold, .92, -5),
      '寶物籃、主課本、蜂蠟筆與毛線'),
    parents: () => frame(
      r(-40, -40, 880, 520, C.violet, .28) + e(400, 330, 500, 120, C.rose, .35) + hill(290, 40, C.prus, .35),
      c(160, 95, 30, C.lemon, .95) + c(300, 60, 4, C.gold, .9) + c(380, 100, 3, C.gold, .9) + c(660, 70, 4, C.gold, .9) + hill(345, 35, C.moss, .62)
      + s('M240 360 Q 236 270 250 205', C.brown, 10) + s('M246 268 q -30 -20 -40 -50', C.brown, 6) + s('M248 238 q 30 -10 40 -40', C.brown, 6)
      + r(470, 275, 92, 70, C.ochre, .9) + p('M456 280 L 516 228 L 576 280 Z', C.carmine, .9) + r(503, 296, 24, 24, C.gold, 1, 0, 'nb'),
      '夜晚山丘上亮著燈的小屋'),
    u1: () => {
      let seeds = '';
      for (let i = 0; i < 5; i++) { const a = -90 + 72 * i, rad = a * Math.PI / 180; seeds += e(520 + 36 * Math.cos(rad), 240 + 36 * Math.sin(rad), 6, 13, C.brown, .9, a + 90); }
      return frame(
        r(-40, -40, 880, 260, C.lemon, .45) + e(170, 110, 170, 130, C.gold, .5) + hill(370, 20, C.leaf, .35),
        c(170, 110, 58, C.gold, .9) + s('M520 124 q 6 -30 20 -42', C.brown, 8) + p('M540 88 q 40 -30 72 0 q -40 26 -72 0 Z', C.leaf) + c(520, 240, 128, C.carmine, .85) + c(520, 240, 110, '#F7E9C0', 1, 'nb') + p(star(520, 240, 58, 24), C.ochre, .45) + seeds
        + chestnut(80, 395) + chestnut(125, 400) + chestnut(170, 393) + chestnut(215, 402) + chestnut(260, 396),
        '太陽與橫切的蘋果，裡面有五角星');
    },
    u2: () => frame(
      r(-40, -40, 880, 520, C.sky, .3) + hill(330, 25, C.leaf, .35),
      r(-20, 392, 840, 90, C.ochre, .45) + c(70, 50, 90, C.moss, .6) + c(175, 30, 70, C.leaf, .6) + s('M110 460 Q 98 260 122 30', C.brown, 40, .9) + s('M130 150 Q 260 142 380 122', C.brown, 12) + owl(310, 90, 1)
      + s('M150 272 L 150 410', C.prus, 3, .45) + snake(150, 300, 470, C.leaf, 26) + snake(150, 370, 290, C.brown, 26),
      '頭對齊樹根比長短的兩條小蛇，與樹上的貓頭鷹'),
    u3: () => frame(
      r(-40, -40, 880, 520, C.sky, .35) + hill(250, 30, C.prus, .3),
      r(-20, 330, 840, 140, C.ultra, .55) + s('M40 390 q 40 -12 80 0 t 80 0 t 80 0', C.sky, 4, .6) + s('M420 420 q 40 -12 80 0 t 80 0 t 80 0', C.sky, 4, .6)
      + p('M-20 296 Q 60 288 110 330 L 110 470 L -20 470 Z', C.moss) + p('M820 296 Q 740 288 690 330 L 690 470 L 820 470 Z', C.moss) + r(80, 318, 640, 22, C.brown, .9)
      + rabbit(160, 318, 1, C.grey) + hedgehog(258, 318, 1) + squirrel(362, 318, .8) + fox(448, 318, 1) + bear(560, 318, 1) + turtle(660, 318, 1),
      '排隊過獨木橋的小動物'),
    u4: () => {
      let left = '', right = '';
      [[235, 318], [262, 306], [290, 318], [250, 332], [280, 334]].forEach((g, i) => { left += gem(g[0], g[1], 1.1, GEMS[i]); });
      [[516, 322], [546, 316]].forEach((g, i) => { right += gem(g[0], g[1], 1.1, GEMS[i + 5]); });
      return frame(
        r(-40, -40, 880, 520, '#F5DFA0', .4) + e(400, 160, 270, 170, C.rose, .3),
        r(-20, 385, 840, 90, C.ochre, .42) + prince(120, 390, .85, C.ultra) + prince(680, 390, .85, C.leaf) + king(400, 390, 1.15) + left + right + p('M212 330 Q 262 400 312 330 Z', C.brown, .9) + p('M480 330 Q 530 400 580 330 Z', C.brown, .9),
        '國王把七顆寶石分給兩位王子');
    },
    u5: () => frame(
      r(-40, -40, 880, 300, C.lemon, .35) + hill(300, 40, C.ultra, .3),
      r(-20, 360, 840, 110, C.leaf, .55) + r(430, 210, 180, 150, C.ochre, .88) + p('M410 215 L 520 108 L 630 215 Z', C.carmine, .9) + c(475, 265, 24, C.lemon, .95, 'nb') + r(542, 285, 40, 75, C.brown, .88)
      + gnome(320, 360, 1, C.verm, C.ultra) + c(120, 338, 22, C.grey) + c(180, 344, 16, C.grey) + s('M78 330 l -34 0', C.grey, 4, .5) + s('M86 350 l -30 0', C.grey, 4, .5)
      + r(680, 320, 52, 40, C.grey) + r(685, 282, 44, 38, C.prus, .6) + r(690, 248, 34, 34, C.grey),
      '小矮人與三角形屋頂、正方形牆、圓形窗的小屋'),
    u6: () => frame(
      r(-40, -40, 880, 520, C.sky, .3) + e(600, 90, 210, 90, C.lemon, .45) + hill(300, 30, C.leaf, .35),
      hill(372, 20, C.leaf, .6) + p('M520 470 Q 560 400 640 384 Q 720 366 820 372 L 820 470 Z', C.ultra, .6) + tree(160, 410, 1, [C.moss, C.leaf, C.ochre]) + acorn(225, 405) + acorn(256, 414) + acorn(610, 378) + acorn(650, 372)
      + gnome(400, 410, 1, C.carmine, C.verm, { plump: true, bag: true }) + s('M690 55 L 690 165', C.brown, 10) + s('M635 110 L 745 110', C.brown, 10) + c(690, 110, 9, C.ochre, .95),
      '背著口袋撿橡實的加加精靈'),
    u7: () => frame(
      r(-40, -40, 880, 520, C.violet, .3) + e(650, 90, 240, 120, C.rose, .35) + hill(280, 40, C.prus, .4),
      c(650, 90, 34, C.lemon, .95) + c(120, 60, 4, C.gold, .9) + c(220, 40, 3, C.gold, .9) + c(330, 80, 3, C.gold, .9) + p('M-20 420 Q 200 360 380 380 Q 560 400 820 330 L 820 470 L -20 470 Z', C.ochre, .6)
      + acorn(470, 392, .9) + acorn(385, 386, .9) + acorn(300, 380, .9) + gnome(575, 378, 1, C.prus, C.violet, { thin: true }),
      '口袋破洞、一路掉橡實的減減精靈'),
    u8: () => frame(
      r(-40, -40, 880, 520, '#F3D08A', .35) + e(200, 120, 260, 160, C.verm, .2),
      r(-20, 382, 840, 90, C.ochre, .5) + p('M470 470 Q 490 250 460 -20 L 700 -20 Q 670 250 700 470 Z', C.brown, .85) + e(585, 250, 50, 70, C.prus, .85) + leafBundle(568, 272, .6) + leafBundle(600, 238, .6)
      + leafBundle(300, 392) + leafBundle(385, 398) + acorn(190, 402) + acorn(222, 412) + acorn(252, 400) + squirrel(120, 386, 1.05)
      + leaf(100, 120, 1, C.verm, 30) + leaf(330, 80, 1, C.gold, -20) + leaf(760, 150, 1, C.verm, 50),
      '把橡實十顆包成一包的松鼠'),
    u9: () => {
      let ticks = '';
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ticks += c(400 + 125 * Math.sin(a), 250 - 125 * Math.cos(a), i === 0 ? 9 : 6, i === 0 ? C.carmine : C.brown, .9); }
      return frame(
        r(-40, -40, 880, 520, C.sky, .25) + e(150, 90, 170, 110, C.gold, .45) + e(700, 90, 170, 110, C.violet, .35),
        c(130, 90, 40, C.gold, .9) + c(700, 90, 30, C.lemon, .95) + c(716, 80, 26, '#E6DEEC', 1, 'nb') + c(400, 250, 150, C.ochre, .3) + s('M250 250 a150 150 0 1 0 300 0 a150 150 0 1 0 -300 0', C.brown, 10) + ticks
        + s('M400 250 L 400 142', C.prus, 10) + e(394, 108, 4, 12, C.grey) + e(406, 108, 4, 12, C.grey) + c(400, 128, 12, C.grey)
        + s('M400 250 L 336 287', C.carmine, 12) + e(322, 294, 15, 10, C.moss) + c(308, 300, 5, C.leaf) + c(400, 250, 10, C.brown, .95),
        '時鐘裡的兔子（長針）與烏龜（短針）');
    }
  };

  /* ---------- 國語插畫 ---------- */
  const t = (x, y, str, col, size, o = .85) => `<text x="${x}" y="${y}" font-size="${size}" font-family="'LXGW WenKai TC','BiauKai','DFKai-SB',serif" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="${col}" fill-opacity="${o}">${str}</text>`;
  const ring = (x, y, rad, col, w = 4, o = .8) => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${col}" fill-opacity=".12" stroke="${col}" stroke-width="${w}" stroke-opacity="${o}"/>`;
  const hand = (x, y, k, col, rot) => `<g transform="rotate(${rot} ${x} ${y})">${e(x, y, 32 * k, 38 * k, col, .8)}${e(x - 40 * k, y + 4 * k, 9 * k, 21 * k, col, .8, -40)}${e(x - 22 * k, y - 52 * k, 8 * k, 24 * k, col, .8, -8)}${e(x - 6 * k, y - 60 * k, 8 * k, 26 * k, col, .8)}${e(x + 10 * k, y - 57 * k, 8 * k, 25 * k, col, .8, 6)}${e(x + 25 * k, y - 46 * k, 7 * k, 20 * k, col, .8, 14)}</g>`;
  const lantern = (x, y, k) => s(`M${x} ${y - 90 * k} L ${x} ${y - 62 * k}`, C.brown, 3) + r(x - 18 * k, y - 66 * k, 36 * k, 10 * k, C.gold, .95) + e(x, y, 48 * k, 58 * k, C.carmine, .9) + r(x - 18 * k, y + 54 * k, 36 * k, 10 * k, C.gold, .95) + s(`M${x} ${y + 64 * k} L ${x} ${y + 100 * k}`, C.gold, 4);

  Object.assign(SCENES, {
    zy: () => frame(
      r(-40, -40, 880, 520, C.lemon, .35) + e(620, 120, 220, 120, C.rose, .25) + hill(330, 30, C.leaf, .35),
      hill(385, 20, C.leaf, .6) + s('M640 410 Q 632 300 644 215', C.brown, 20) + s('M643 222 Q 606 160 574 118', C.brown, 11) + s('M643 222 Q 680 160 712 112', C.brown, 11)
      + e(712, 100, 18, 13, C.verm) + c(726, 90, 8, C.verm) + p('M733 89 l 10 3 l -10 3 Z', C.gold, .95)
      + `<g transform="rotate(16 300 400)">${gnome(300, 400, 1, C.carmine, C.ultra)}</g>` + c(356, 330, 20, C.carmine, .9) + s('M356 310 q 4 -10 12 -12', C.brown, 3)
      + t(120, 170, 'ㄅ', C.carmine, 120) + t(470, 150, 'ㄚ', C.prus, 110) + t(530, 330, 'ㄇ', C.violet, 96),
      '彎腰抱著蘋果的小矮人、分叉的樹枝，和注音符號ㄅ、ㄚ、ㄇ'),
    magic: () => frame(
      r(-40, -40, 880, 300, C.sky, .35) + e(150, 90, 170, 110, C.gold, .4) + e(690, 80, 160, 100, C.violet, .25),
      c(150, 95, 42, C.gold, .9) + p('M690 54 A 32 32 0 0 0 690 118 A 40 40 0 0 1 690 54 Z', C.gold, .95)
      + p('M20 385 L 190 150 L 285 285 L 380 110 L 480 285 L 565 175 L 740 385 Z', C.prus, .7)
      + hill(350, 15, C.leaf, .72) + tree(650, 410, .75, [C.moss, C.leaf, C.moss])
      + p('M-20 470 Q 200 380 380 402 Q 560 424 820 364 L 820 470 Z', C.ultra, .62) + s('M120 440 q 40 -12 80 0 t 80 0', C.sky, 4, .6) + s('M460 432 q 40 -12 80 0 t 80 0', C.sky, 4, .6),
      '太陽、月亮、山、樹和河：日月山木水'),
    boat: () => frame(
      r(-40, -40, 880, 320, C.sky, .35) + e(620, 90, 200, 90, C.lemon, .4) + hill(260, 30, C.leaf, .35),
      r(-20, 290, 840, 180, C.ultra, .55) + s('M60 350 q 40 -12 80 0 t 80 0', C.sky, 4, .6) + s('M520 420 q 40 -12 80 0 t 80 0 t 80 0', C.sky, 4, .6)
      + s('M40 300 L 30 220', C.moss, 5) + s('M60 300 L 66 210', C.moss, 5) + s('M84 300 L 78 236', C.moss, 5)
      + s('M430 322 L 430 150', C.brown, 8) + p('M438 160 L 438 300 L 550 300 Z', C.carmine, .85)
      + gnome(330, 322, .62, C.verm, C.leaf) + s('M345 290 L 250 372', C.brown, 6)
      + p('M250 318 L 580 318 Q 550 380 420 384 Q 300 380 250 318 Z', C.brown, .9),
      '小矮人坐著小船在河上划'),
    hands: () => frame(
      r(-40, -40, 880, 520, '#F3DFA8', .35) + e(400, 230, 380, 170, C.rose, .22),
      hand(170, 220, 1.1, C.carmine, -18) + hand(330, 310, .9, C.ultra, 10) + hand(480, 190, 1.2, C.gold, -4) + hand(630, 310, 1, C.leaf, 16) + hand(720, 160, .8, C.violet, -12),
      '五顏六色的手印'),
    bubbles: () => frame(
      r(-40, -40, 880, 520, C.sky, .3) + e(600, 120, 260, 140, C.lemon, .35) + hill(330, 25, C.leaf, .35),
      hill(390, 18, C.leaf, .62) + gnome(170, 400, 1, C.verm, C.gold) + s('M186 280 L 244 250', C.brown, 4) + ring(258, 242, 12, C.ultra, 3)
      + ring(360, 200, 44, C.ultra) + ring(470, 130, 70, C.violet) + ring(420, 300, 26, C.carmine) + ring(600, 220, 52, C.prus) + ring(700, 110, 30, C.carmine) + ring(560, 340, 18, C.gold),
      '小矮人吹出大大小小的泡泡'),
    hello: () => frame(
      r(-40, -40, 880, 520, C.lemon, .35) + e(400, 110, 240, 110, C.gold, .35) + hill(320, 30, C.leaf, .35),
      c(400, 105, 44, C.gold, .9) + hill(390, 18, C.leaf, .62)
      + gnome(280, 400, 1, C.carmine, C.ultra) + s('M306 330 Q 340 300 350 250', C.ultra, 12) + c(352, 244, 9, C.skin, .95)
      + gnome(540, 400, .85, C.prus, C.verm) + s('M518 340 Q 488 310 480 268', C.verm, 11) + c(478, 262, 8, C.skin, .95)
      + s('M372 236 q 8 -10 0 -20', C.gold, 3, .8) + s('M456 250 q -8 -10 0 -20', C.gold, 3, .8),
      '兩個小矮人揮手說你好'),
    alien: () => frame(
      r(-40, -40, 880, 520, C.ultra, .5) + e(560, 140, 260, 140, C.violet, .45) + hill(330, 30, C.prus, .45),
      c(100, 60, 4, C.lemon, .95, 'nb') + c(220, 120, 3, C.lemon, .95, 'nb') + c(320, 50, 4, C.lemon, .95, 'nb') + c(760, 60, 3, C.lemon, .95, 'nb') + c(700, 240, 3, C.lemon, .95, 'nb')
      + p('M470 180 L 380 390 L 660 390 L 570 180 Z', C.lemon, .35) + e(520, 170, 120, 34, C.grey, .92) + e(520, 145, 52, 40, C.sky, .9)
      + c(450, 178, 6, C.gold, .95, 'nb') + c(520, 186, 6, C.gold, .95, 'nb') + c(590, 178, 6, C.gold, .95, 'nb')
      + hill(395, 16, C.moss, .7) + e(520, 360, 16, 22, C.leaf, .95) + c(520, 326, 15, C.leaf, .95) + s('M512 314 l -8 -16', C.leaf, 3) + s('M528 314 l 8 -16', C.leaf, 3)
      + c(504, 296, 4, C.gold, .95, 'nb') + c(536, 296, 4, C.gold, .95, 'nb')
      + r(120, 300, 110, 80, C.ochre, .9) + p('M104 305 L 175 250 L 246 305 Z', C.carmine, .9) + r(160, 322, 26, 26, C.gold, 1, 0, 'nb'),
      '夜空中的飛船和小外星人'),
    goldfish: () => frame(
      r(-40, -40, 880, 520, '#F1E3B8', .35) + e(400, 260, 330, 190, C.sky, .3),
      r(-20, 400, 840, 70, C.ochre, .5) + p('M260 150 Q 230 260 270 360 Q 400 420 530 360 Q 570 260 540 150 Z', C.sky, .45)
      + p('M250 190 Q 400 170 550 190 Q 575 280 530 360 Q 400 420 270 360 Q 228 280 250 190 Z', C.ultra, .3)
      + s('M320 370 Q 300 320 320 270', C.moss, 6) + s('M340 372 Q 360 320 344 280', C.leaf, 5) + s('M480 368 Q 470 330 490 300', C.moss, 6)
      + p('M330 250 L 300 225 L 305 275 Z', C.verm, .88) + e(375, 250, 48, 28, C.verm, .9) + c(402, 244, 4, C.prus, .95, 'nb')
      + p('M500 300 L 522 284 L 520 316 Z', C.gold, .88) + e(470, 300, 28, 16, C.gold, .9) + c(455, 296, 3, C.prus, .95, 'nb')
      + ring(420, 205, 8, C.sky, 2) + ring(432, 180, 6, C.sky, 2) + ring(418, 160, 5, C.sky, 2),
      '魚缸裡的兩條小金魚吐泡泡'),
    spring: () => frame(
      r(-40, -40, 880, 520, C.lemon, .35) + e(400, 240, 360, 180, C.rose, .3),
      lantern(130, 190, 1) + lantern(670, 190, 1)
      + p('M400 70 L 560 230 L 400 390 L 240 230 Z', C.carmine, .9) + t(400, 232, '春', '#2B2530', 150, .9)
      + s('M-10 430 Q 120 380 240 400', C.brown, 8) + s('M140 400 q 10 -30 30 -40', C.brown, 5)
      + c(60, 404, 10, C.rose, .9) + c(110, 392, 9, C.rose, .9) + c(170, 360, 9, C.rose, .9) + c(210, 398, 8, C.rose, .9) + c(150, 408, 7, C.carmine, .8),
      '紅紙上的春字、紅燈籠和梅花')
  });

  window.SCENES = SCENES;
  window.art = (key) => `<div class="art">${SCENES[key]()}</div>`;
})();
