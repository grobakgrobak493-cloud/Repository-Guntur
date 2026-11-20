(function(){
const KEY = 'guntur-cv-umb-v5';
const DEF = {
  text: {},
  info: [
    {k: 'Full Name', v: 'Muhamad Guntur Ramadhan'},
    {k: 'Nickname', v: 'Guntur'},
    {k: 'NPM', v: '2657201021'},
    {k: 'Status', v: 'Student Universitas Muhammadiyah Bengkulu (UMB)'},
    {k: 'Field', v: 'Information System'},
    {k: 'Interests', v: 'Programming, Editing, Gaming'},
    {k: 'Agama', v: 'Islam'},
    {k: 'Negara', v: 'Indonesia'}
  ],
  skills: {
    prog: [
      ['Logika Pemrograman', 55],
      ['HTML5 & CSS3 (Tampilan Web)', 55],
      ['JavaScript & Web Interaktif', 55],
      ['PHP & Database', 55]
    ],
    edit: [
      ['Video Editing (Merangkai Klip)', 60],
      ['Ritme & Timing Editing', 60],
      ['Suasana & Color Grading', 60],
      ['Storytelling Visual', 60]
    ],
    game: [
      ['Strategi & Game Sense', 90],
      ['Kerja Sama Tim', 90],
      ['Komunikasi In-Game', 90],
      ['Adaptasi & Problem Solving', 90]
    ]
  },
  growth: {
    prog: [20, 30, 38, 44, 50, 55],
    edit: [25, 35, 42, 48, 55, 60],
    game: [40, 52, 63, 73, 82, 90]
  }
};

let S = JSON.parse(JSON.stringify(DEF));
try {
  const r = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (r) {
    if (r.skills) S.skills = r.skills;
    if (r.growth) S.growth = r.growth;
    if (r.text) S.text = r.text;
  }
} catch(e) {}

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ skills: S.skills, growth: S.growth, text: S.text }));
  } catch(e) {}
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (t, c, x) => {
  const e = document.createElement(t);
  if (c) e.className = c;
  if (x != null) e.textContent = x;
  return e;
};
const clamp = v => Math.max(0, Math.min(100, Math.round(+v || 0)));

/* Editable text */
const LOCK_TEXT = true; // true = teks dikunci (tidak bisa diedit); false = teks bisa diedit lagi
function makeEd(el, get, set, multi) {
  el.textContent = get();
  if (LOCK_TEXT) return el;
  el.classList.add('ed');
  el.setAttribute('contenteditable', 'true');
  el.addEventListener('input', () => {
    set(multi ? el.innerText : el.textContent);
    save();
  });
  if (!multi) {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  }
  return el;
}

/* Bind static data-k */
$$('[data-k]').forEach(el => {
  const k = el.dataset.k, multi = el.hasAttribute('data-multi');
  makeEd(el, () => (S.text[k] != null ? S.text[k] : el.textContent), v => { S.text[k] = v; }, multi);
});

/* Render Personal Info */
function renderInfo() {
  const dl = $('#info');
  if (!dl) return;
  dl.innerHTML = '';
  S.info.forEach((it) => {
    const row = h('div', 'row');
    const dt = h('dt');
    const dd = h('dd');
    makeEd(dt, () => it.k, v => { it.k = v; });
    makeEd(dd, () => it.v, v => {
      it.v = v;
      dd.classList.toggle('ph', v.trim() === 'Belum diisi');
    });
    dd.classList.toggle('ph', it.v.trim() === 'Belum diisi');
    row.append(dt, dd);
    dl.append(row);
  });
}

/* Card Spotlight effect */
$$('.card').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* Skills RPG */
const CATS = [
  { id: 'prog', name: 'Web Programmer', icon: 'M16 18l6-6-6-6 M8 6l-6 6 6 6' },
  { id: 'edit', name: 'Editor', icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  { id: 'game', name: 'Gaming', icon: 'M6 12h4 M8 10v4 M15 13h.01 M18 11h.01 M17.32 5H6.68a4 4 0 0 0-3.98 3.59L2 19a2 2 0 0 0 3.4 1.4L8 18h8l2.6 2.4A2 2 0 0 0 22 19l-.7-10.41A4 4 0 0 0 17.32 5z' }
];
const inputs = {};

function buildSkills() {
  const root = $('#cats');
  if (!root) return;
  root.innerHTML = '';
  CATS.forEach((c, ci) => {
    const card = h('div', 'cat glass rv');
    card.dataset.c = c.id;
    card.style.setProperty('--d', (ci * 0.08) + 's');
    card.innerHTML = `
      <div class="cat-h">
        <div class="ico">
          <svg viewBox="0 0 24 24"><path d="${c.icon}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3>${c.name}</h3>
        <span class="lvb" data-lv>LV 1</span>
      </div>
      <div>
        <div class="xp"><i data-xb></i></div>
        <div class="xpt"><span data-xt>EXP 0 / 40</span><span data-xs>0 / 400</span></div>
      </div>
    `;

    S.skills[c.id].forEach((s, si) => {
      const sk = h('div', 'sk');
      const hd = h('div', 'sk-h');
      const nm = h('span');
      makeEd(nm, () => s[0], v => { s[0] = v; });

      const box = h('span', 'pctbox');
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.min = 0;
      inp.max = 100;
      inp.value = s[1];
      inp.id = `p-${c.id}-${si}`;
      inp.setAttribute('aria-label', `Persentase ${s[0]}`);

      inp.addEventListener('input', () => {
        s[1] = clamp(inp.value);
        save();
        updateSkills();
      });
      inp.addEventListener('blur', () => { inp.value = s[1]; });

      box.append(inp, '%');
      hd.append(nm, box);

      const bar = h('div', 'bar');
      const i = document.createElement('i');
      bar.append(i);

      sk.append(hd, bar);
      card.append(sk);
      inputs[`${c.id}-${si}`] = { inp, bar: i };
    });
    root.append(card);
  });
}

let revealed = false;
const lvl = (xp, per, max) => {
  const l = Math.min(max, Math.floor(xp / per) + 1);
  const into = l === max ? Math.min(per, xp - per * (max - 1)) : xp % per;
  return [l, into];
};

function updateSkills() {
  let tot = 0;
  const avg = {};
  CATS.forEach(c => {
    const arr = S.skills[c.id];
    const xp = arr.reduce((a, s) => a + s[1], 0);
    tot += xp;
    avg[c.id] = Math.round(xp / arr.length);
    const [l, into] = lvl(xp, 40, 10);
    const card = $(`.cat[data-c=${c.id}]`);
    if (card) {
      $('[data-lv]', card).textContent = 'LV ' + l;
      $('[data-xt]', card).textContent = `EXP ${into} / 40`;
      $('[data-xs]', card).textContent = `${xp} / ${arr.length * 100}`;
      $('[data-xb]', card).style.width = revealed ? (into / 40 * 100) + '%' : '0%';
    }
    arr.forEach((s, si) => {
      if (inputs[`${c.id}-${si}`]) {
        inputs[`${c.id}-${si}`].bar.style.width = revealed ? s[1] + '%' : '0%';
      }
    });
  });

  const [ol, oi] = lvl(tot, 400, 10);
  if ($('#ovLv')) $('#ovLv').textContent = ol;
  if ($('#ovXp')) $('#ovXp').textContent = `EXP ${oi} / 400`;
  if ($('#ovTot')) $('#ovTot').textContent = `Total ${tot} / 4000`;
  if ($('#ovBar')) $('#ovBar').style.width = revealed ? (oi / 120 * 100) + '%' : '0%';
  if (revealed) {
    CATS.forEach(c => {
      const el = $('#st_' + c.id);
      if (el) el.textContent = avg[c.id];
    });
  }
}

function revealSkills() {
  if (revealed) return;
  revealed = true;
  updateSkills();
}

/* Growth Chart */
function drawChart() {
  const svg = $('#chartSvg');
  if (!svg) return;
  const W = 640, H = 260, L = 40, R = 44, T = 16, B = 36;
  const pw = W - L - R, ph = H - T - B;
  const x = i => L + (pw * i) / 5;
  const y = v => T + ph * (1 - v / 100);

  let s = '';
  [0, 25, 50, 75, 100].forEach(v => {
    s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 10}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  });
  for (let i = 0; i < 6; i++) {
    s += `<text x="${x(i)}" y="${H - 10}" text-anchor="middle">Fase ${i + 1}</text>`;
  }

  const cols = { prog: 'var(--c1)', edit: 'var(--c2)', game: 'var(--c3)' };
  const ends = [];

  CATS.forEach(c => {
    const d = S.growth[c.id];
    s += `<polyline class="ln" stroke="${cols[c.id]}" points="${d.map((v, i) => x(i) + ',' + y(v)).join(' ')}"/>`;
    d.forEach((v, i) => {
      s += `<circle cx="${x(i)}" cy="${y(v)}" r="${i === 5 ? 5 : 3}" fill="${i === 5 ? cols[c.id] : 'var(--bg)'}" stroke="${cols[c.id]}" stroke-width="2"/>`;
    });
    ends.push({ c: c.id, v: d[5], y: y(d[5]) });
  });

  ends.sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) {
    if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
  }
  ends.forEach(e => {
    s += `<text x="${W - R + 10}" y="${e.y + 4}" style="fill:${cols[e.c]};font-weight:bold">${e.v}%</text>`;
  });
  svg.innerHTML = s;
}

function buildGrowthTable() {
  const t = $('#gtab');
  if (!t) return;
  let hd = '<tr><th>Kompetensi</th>';
  for (let i = 1; i <= 6; i++) hd += `<th>Fase ${i}</th>`;
  t.innerHTML = hd + '</tr>';

  CATS.forEach(c => {
    const tr = h('tr');
    const td = h('td', null, c.name);
    tr.append(td);
    S.growth[c.id].forEach((v, i) => {
      const cell = h('td');
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.min = 0;
      inp.max = 100;
      inp.value = v;
      inp.id = `g-${c.id}-${i}`;
      inp.setAttribute('aria-label', `${c.name} fase ${i + 1}`);
      inp.addEventListener('input', () => {
        S.growth[c.id][i] = clamp(inp.value);
        save();
        drawChart();
      });
      cell.append(inp);
      tr.append(cell);
    });
    t.append(tr);
  });
}

/* Reset data */
let armed = 0;
if ($('#reset')) {
  $('#reset').addEventListener('click', e => {
    const b = e.currentTarget;
    if (!armed) {
      armed = 1;
      b.classList.add('arm');
      b.textContent = 'Klik lagi untuk konfirmasi reset';
      setTimeout(() => {
        armed = 0;
        b.classList.remove('arm');
        b.textContent = 'Reset ke Bawaan';
      }, 4000);
      return;
    }
    try { localStorage.removeItem(KEY); } catch(_) {}
    location.reload();
  });
}

/* Scroll reveal & observer */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      if (en.target.id === 'sheet' || en.target.dataset.c) revealSkills();
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

$$('.rv').forEach(el => io.observe(el));

/* Active Nav ScrollSpy */
const secs = $$('main section[id]');
const navA = $$('.links a');
window.addEventListener('scroll', () => {
  let cur = '';
  const vh = window.innerHeight;
  secs.forEach(s => {
    if (s.getBoundingClientRect().top < vh * 0.4) cur = s.id;
  });
  navA.forEach(a => {
    a.classList.toggle('on', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });


/* Loader */
(function(){
  const L=$('#loader'),b=$('#ldBar'),p=$('#ldPct');let n=0;
  const t=setInterval(()=>{n=Math.min(100,n+8+(Math.random()*10|0));if(b)b.style.width=n+'%';if(p)p.textContent=n+'%';
    if(n>=100){clearInterval(t);setTimeout(()=>L&&L.classList.add('out'),250);}},90);
})();

/* Terminal */
(function(){
  const out=$('#termOut'),inp=$('#termIn');if(!out||!inp)return;
  const R={
    help:['Perintah: help, about, skills, projects, clear'],
    about:[S.info[0].v+' - '+S.info[3].v,'Bidang: '+S.info[4].v+' | Minat: '+S.info[5].v],
    skills:CATS.map(c=>c.name+': '+Math.round(S.skills[c.id].reduce((a,s)=>a+s[1],0)/S.skills[c.id].length)+'%'),
    projects:['Lihat bagian Proyek di bawah (#projects).']
  };
  const run=c=>{c=c.trim().toLowerCase();if(!c)return;
    if(c==='clear'){out.innerHTML='';return;}
    out.append(h('p',null,'$ '+c));
    (R[c]||['Perintah tidak dikenal: '+c+'. Ketik help.']).forEach(l=>out.append(h('p',null,l)));
    out.scrollTop=out.scrollHeight;};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){run(inp.value);inp.value='';}});
  $$('[data-cmd]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.cmd)));
})();

/* Filter proyek */
$$('.filters button').forEach(b=>b.addEventListener('click',()=>{
  $$('.filters button').forEach(x=>x.classList.toggle('on',x===b));
  $$('#projGrid .card').forEach(c=>c.classList.toggle('hide',b.dataset.f!=='all'&&c.dataset.t!==b.dataset.f));
}));

/* Form kontak (membuka aplikasi email) */
const cf=$('#ctForm');
if(cf)cf.addEventListener('submit',e=>{e.preventDefault();
  const body='Nama: '+$('#cfN').value+'\nEmail: '+$('#cfE').value+'\n\n'+$('#cfM').value;
  location.href='mailto:m.guntur2657@gmail.com?subject='+encodeURIComponent($('#cfS').value)+'&body='+encodeURIComponent(body);});

/* Init */
if ($('#yr')) $('#yr').textContent = new Date().getFullYear();
renderInfo();
buildSkills();
buildGrowthTable();
drawChart();
updateSkills();

})();
