/* Glamista — Bar à ongles · scripts */

/* ===================== À PERSONNALISER ===================== */
// Numéro WhatsApp du salon (format international, sans + ni espaces). ⚠️ À remplacer.
var WA_NUMBER = '212600000000';

// Jours fermés (0 = dimanche, 1 = lundi … 6 = samedi). À confirmer.
var CLOSED_DAYS = [1];
// Horaires d'ouverture (format 24h)
var OPEN = '10:30', CLOSE = '20:30', STEP = 30; // créneaux toutes les 30 min

// Prestations : cat = 'ongles' | 'cils' | 'sourcils', dur en minutes.
// Remplacer [PRIX] par les vrais tarifs, ex. '150 DH'.
var SERVICES = [
  { id: 'gel', cat: 'ongles', name: 'Pose gel / capsules', dur: 90, price: '[PRIX] DH' },
  { id: 'remplissage', cat: 'ongles', name: 'Remplissage gel', dur: 75, price: '[PRIX] DH' },
  { id: 'semi', cat: 'ongles', name: 'Semi-permanent mains', dur: 45, price: '[PRIX] DH' },
  { id: 'russe', cat: 'ongles', name: 'Manucure russe', dur: 60, price: '[PRIX] DH' },
  { id: 'nailart', cat: 'ongles', name: 'Nail art (supplément)', dur: 15, price: '[PRIX] DH' },
  { id: 'pieds', cat: 'ongles', name: 'Semi-permanent pieds', dur: 45, price: '[PRIX] DH' },
  { id: 'spa', cat: 'ongles', name: 'Beauté des pieds spa', dur: 60, price: '[PRIX] DH' },
  { id: 'depose', cat: 'ongles', name: 'Dépose', dur: 20, price: '[PRIX] DH' },
  { id: 'cilacil', cat: 'cils', name: 'Extensions cil à cil', dur: 120, price: '[PRIX] DH' },
  { id: 'volume', cat: 'cils', name: 'Extensions volume russe', dur: 150, price: '[PRIX] DH' },
  { id: 'rehaussement', cat: 'cils', name: 'Rehaussement de cils', dur: 60, price: '[PRIX] DH' },
  { id: 'remplcils', cat: 'cils', name: 'Remplissage cils', dur: 60, price: '[PRIX] DH' },
  { id: 'restructuration', cat: 'sourcils', name: 'Restructuration sourcils', dur: 30, price: '[PRIX] DH' },
  { id: 'browlift', cat: 'sourcils', name: 'Brow lift', dur: 45, price: '[PRIX] DH' },
  { id: 'henne', cat: 'sourcils', name: 'Henné sourcils', dur: 40, price: '[PRIX] DH' },
  { id: 'teinture', cat: 'sourcils', name: 'Teinture sourcils', dur: 20, price: '[PRIX] DH' }
];
var PROS = [
  { id: 'any', name: 'Peu importe', role: 'La première disponible' },
  { id: 'p1', name: '[PRÉNOM 1]', role: 'Prothésiste ongulaire' },
  { id: 'p2', name: '[PRÉNOM 2]', role: 'Experte cils & sourcils' }
];
/* =========================================================== */

var CAT_NAMES = { ongles: 'Ongles', cils: 'Cils', sourcils: 'Sourcils' };
function waLink(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }
function fmtDur(m) { var h = Math.floor(m / 60), r = m % 60; return h ? h + 'h' + (r ? (r < 10 ? '0' : '') + r : '') : r + ' min'; }
function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
function toHHMM(m) { return Math.floor(m / 60) + 'h' + (m % 60 < 10 ? '0' : '') + (m % 60); }

/* ===================== Illustrations nail art ===================== */
var gid = 0;
var DESIGNS = {
  nude:     { name: 'Nude glossy', base: '#E7C3B6' },
  french:   { name: 'French classique', base: '#F3E2DB', tip: '#FFFFFF' },
  rouge:    { name: 'Rouge iconique', base: '#9E1328' },
  chrome:   { name: 'Chrome perle', grad: ['#FFFFFF', '#E9E4EC', '#C9C3CC'] },
  ombre:    { name: 'Ombré rosé', grad: ['#FBE6EA', '#EBB2C0', '#D98A9E'] },
  boomer:   { name: 'Baby boomer', grad: ['#FFFFFF', '#F4DED6', '#E6C0B2'] },
  noir:     { name: 'Noir & or', base: '#1F1C1C', line: '#C9A24E' },
  floral:   { name: 'Floral blanc', base: '#FAF6F2', flower: '#E9A0B4' },
  sage:     { name: 'Sauge & swirl', base: '#AEBEA2', swirl: '#FFFFFF' },
  dots:     { name: 'Milky & points dorés', base: '#F2EEE8', dot: '#C9A24E' },
  lilas:    { name: 'Lilas pastel', base: '#CDB8E2' },
  frenchc:  { name: 'French couleur', base: '#F3E2DB', tip: '#D98A9E' }
};
function nailsSVG(key, label) {
  var d = DESIGNS[key], id = 'n' + (gid++), defs = '', fill;
  if (d.grad) {
    defs += '<linearGradient id="' + id + 'g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="' + d.grad[0] + '"/><stop offset=".55" stop-color="' + d.grad[1] + '"/><stop offset="1" stop-color="' + d.grad[2] + '"/></linearGradient>';
    fill = 'url(#' + id + 'g)';
  } else fill = d.base;
  var NAIL = 'M-21 40 L-21 -18 Q-21 -58 0 -66 Q21 -58 21 -18 L21 40 Q0 48 -21 40Z';
  defs += '<clipPath id="' + id + 'c"><path d="' + NAIL + '"/></clipPath>';
  var pos = [[-112, 34, -16, .9], [-58, 8, -7, 1], [0, 0, 0, 1.04], [58, 8, 7, 1], [112, 34, 16, .9]];
  var s = '<svg viewBox="-160 -110 320 200" role="img" aria-label="' + (label || d.name) + '" xmlns="http://www.w3.org/2000/svg"><defs>' + defs + '</defs>';
  pos.forEach(function (p, i) {
    var g = '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ') scale(' + p[3] + ')">';
    // doigt
    g += '<path d="M-30 50 L-30 -10 Q-30 -45 0 -48 Q30 -45 30 -10 L30 50" fill="#EBCDBE" opacity=".55"/>';
    g += '<path d="' + NAIL + '" fill="' + fill + '" stroke="rgba(0,0,0,.08)" stroke-width="1.2"/>';
    var inner = '';
    if (d.tip) inner += '<path d="M-30 -30 Q0 -14 30 -30 L30 -80 L-30 -80Z" fill="' + d.tip + '"/>';
    if (d.line && (i === 1 || i === 3)) inner += '<path d="M-21 10 L21 -30" stroke="' + d.line + '" stroke-width="3"/><path d="M-21 22 L21 -18" stroke="' + d.line + '" stroke-width="1.4"/>';
    if (d.line && i === 2) inner += '<path d="M0 -50 L0 30" stroke="' + d.line + '" stroke-width="2.4"/>';
    if (d.flower && (i === 1 || i === 3)) {
      for (var k = 0; k < 5; k++) inner += '<ellipse cx="0" cy="-12" rx="5" ry="9" fill="' + d.flower + '" transform="translate(0 -6) rotate(' + k * 72 + ' 0 -6)"/>';
      inner += '<circle cx="0" cy="-6" r="3.5" fill="#F4C76B"/>';
    }
    if (d.swirl) inner += '<path d="M-18 ' + (20 - i * 4) + ' C-4 -10 10 30 18 -' + (20 + i * 3) + '" fill="none" stroke="' + d.swirl + '" stroke-width="3.2" stroke-linecap="round"/>';
    if (d.dot) [[-8, -30], [7, -12], [-6, 8], [8, 24]].forEach(function (q, j) { if ((i + j) % 2 === 0) inner += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3.6" fill="' + d.dot + '"/>'; });
    // reflet brillant
    inner += '<path d="M-11 -40 Q-14 -10 -11 24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45" fill="none"/>';
    g += '<g clip-path="url(#' + id + 'c)">' + inner + '</g></g>';
    s += g;
  });
  return s + '</svg>';
}

/* ===================== Démarrage ===================== */
document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
  if (burger && nav) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa') || 'Bonjour Glamista !');
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-nails]').forEach(function (el) { el.innerHTML = nailsSVG(el.getAttribute('data-nails')); });
  document.querySelectorAll('[data-price]').forEach(function (el) {
    var s = SERVICES.filter(function (x) { return x.id === el.getAttribute('data-price'); })[0];
    if (s) el.textContent = s.price;
  });
  initGallery();
  initBooking();
});

/* ===================== Galerie ===================== */
function initGallery() {
  var g = document.getElementById('gallery');
  if (!g) return;
  var box = document.getElementById('lightbox'), inner = box.querySelector('.lb-inner'), cap = box.querySelector('.lcap');
  var items = g.querySelectorAll('button');
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
  items.forEach(function (b) {
    b.addEventListener('click', function () {
      inner.innerHTML = b.querySelector('.gi').innerHTML;
      cap.textContent = b.getAttribute('aria-label');
      box.classList.add('open'); document.body.style.overflow = 'hidden';
      box.querySelector('.close').focus();
    });
  });
  box.querySelector('.close').addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  var pills = document.querySelectorAll('#gfilters .pill');
  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      var c = p.getAttribute('data-cat');
      pills.forEach(function (x) { x.classList.toggle('on', x === p); x.setAttribute('aria-pressed', x === p ? 'true' : 'false'); });
      items.forEach(function (b) { b.hidden = !(c === 'Tout' || b.getAttribute('data-cat') === c); });
    });
  });
}

/* ===================== Réservation ===================== */
function initBooking() {
  var root = document.getElementById('booking');
  if (!root) return;
  var params = new URLSearchParams(location.search);
  var st = { tab: 'ongles', sel: {}, pro: 'any', day: null, slot: null };
  var pre = SERVICES.filter(function (s) { return s.id === params.get('service'); })[0];
  if (pre) { st.sel[pre.id] = true; st.tab = pre.cat; }
  else if (CAT_NAMES[params.get('cat')]) st.tab = params.get('cat');

  var DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  var DAYS_L = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var dates = [], t = new Date();
  for (var i = 0; i < 21; i++) dates.push(new Date(t.getFullYear(), t.getMonth(), t.getDate() + i));

  var tabsEl = document.getElementById('tabs'), listEl = document.getElementById('svc-list');
  tabsEl.innerHTML = Object.keys(CAT_NAMES).map(function (c) { return '<button type="button" class="pill" data-c="' + c + '">' + CAT_NAMES[c] + '</button>'; }).join('');
  tabsEl.querySelectorAll('.pill').forEach(function (b) { b.addEventListener('click', function () { st.tab = b.getAttribute('data-c'); render(); }); });

  var proEl = document.getElementById('pro-list');
  proEl.innerHTML = PROS.map(function (p) { return '<button type="button" class="pro" data-p="' + p.id + '"><b>' + p.name + '</b><small>' + p.role + '</small></button>'; }).join('');
  proEl.querySelectorAll('.pro').forEach(function (b) { b.addEventListener('click', function () { st.pro = b.getAttribute('data-p'); render(); }); });

  var dayEl = document.getElementById('day-list');
  dayEl.innerHTML = dates.map(function (d, i) {
    var closed = CLOSED_DAYS.indexOf(d.getDay()) !== -1;
    return '<button type="button" class="day" data-i="' + i + '"' + (closed ? ' disabled title="Fermé"' : '') + ' aria-label="' + DAYS_L[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + (closed ? ', fermé' : '') + '"><small>' + (i === 0 ? 'Auj.' : DAYS[d.getDay()]) + '</small><b>' + d.getDate() + '</b><small>' + MONTHS[d.getMonth()] + '</small></button>';
  }).join('');
  dayEl.querySelectorAll('.day').forEach(function (b) { b.addEventListener('click', function () { st.day = +b.getAttribute('data-i'); st.slot = null; render(); }); });

  var slotEl = document.getElementById('slot-list');
  ['fname', 'fphone', 'fnote'].forEach(function (id) { document.getElementById(id).addEventListener('input', render); });

  function chosen() { return SERVICES.filter(function (s) { return st.sel[s.id]; }); }
  function totalDur() { return chosen().reduce(function (n, s) { return n + s.dur; }, 0); }
  function dayLabel() { if (st.day === null) return '—'; var d = dates[st.day]; return DAYS_L[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function val(id) { return document.getElementById(id).value.trim(); }

  function render() {
    tabsEl.querySelectorAll('.pill').forEach(function (b) { var on = b.getAttribute('data-c') === st.tab; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    listEl.innerHTML = SERVICES.filter(function (s) { return s.cat === st.tab; }).map(function (s) {
      var on = !!st.sel[s.id];
      return '<button type="button" class="sopt' + (on ? ' on' : '') + '" data-s="' + s.id + '" aria-pressed="' + on + '"><span class="box"></span><span class="t"><b>' + s.name + '</b><small>' + fmtDur(s.dur) + ' · ' + s.price + '</small></span></button>';
    }).join('');
    listEl.querySelectorAll('.sopt').forEach(function (b) {
      b.addEventListener('click', function () { var id = b.getAttribute('data-s'); if (st.sel[id]) delete st.sel[id]; else st.sel[id] = true; st.slot = null; render(); });
    });
    proEl.querySelectorAll('.pro').forEach(function (b) { var on = b.getAttribute('data-p') === st.pro; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    dayEl.querySelectorAll('.day').forEach(function (b) { var on = +b.getAttribute('data-i') === st.day; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });

    var svcs = chosen(), dur = totalDur();
    document.getElementById('sel-count').textContent = svcs.length ? svcs.length + ' choisie' + (svcs.length > 1 ? 's' : '') + ' · ' + fmtDur(dur) : '';

    // créneaux
    if (st.day === null) slotEl.innerHTML = '<p class="empty">Choisissez d\'abord un jour.</p>';
    else {
      var last = toMin(CLOSE) - Math.max(dur, 30), now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes() + 60, html = '';
      for (var m = toMin(OPEN); m <= last; m += STEP) {
        if (st.day === 0 && m < nowMin) continue;
        var lab = toHHMM(m);
        html += '<button type="button" class="slot' + (st.slot === lab ? ' on' : '') + '" data-s="' + lab + '" aria-pressed="' + (st.slot === lab) + '">' + lab + '</button>';
      }
      slotEl.innerHTML = html || '<p class="empty">Plus de créneau disponible ce jour-là pour cette durée. Choisissez un autre jour.</p>';
      slotEl.querySelectorAll('.slot').forEach(function (b) { b.addEventListener('click', function () { st.slot = b.getAttribute('data-s'); render(); }); });
    }

    // récap
    var pro = PROS.filter(function (p) { return p.id === st.pro; })[0];
    document.getElementById('r-svc').innerHTML = svcs.length ? '<ul>' + svcs.map(function (s) { return '<li>' + s.name + '</li>'; }).join('') + '</ul>' : '—';
    document.getElementById('r-dur').textContent = dur ? fmtDur(dur) : '—';
    document.getElementById('r-pro').textContent = pro.name;
    document.getElementById('r-date').textContent = st.day === null ? '—' : dayLabel() + (st.slot ? ' à ' + st.slot : '');

    var name = val('fname'), phone = val('fphone'), note = val('fnote'), missing = [];
    if (!svcs.length) missing.push('une prestation');
    if (st.day === null) missing.push('un jour');
    if (!st.slot) missing.push('une heure');
    if (!name) missing.push('votre nom');
    if (!phone) missing.push('votre téléphone');
    var ready = !missing.length, btn = document.getElementById('send');
    btn.setAttribute('aria-disabled', ready ? 'false' : 'true');
    btn.classList.toggle('off', !ready);
    document.getElementById('hint').textContent = ready ? 'Tout est prêt : votre demande s\'ouvre dans WhatsApp.' : 'Il manque : ' + missing.join(', ') + '.';
    btn.href = ready ? waLink('Bonjour Glamista ! 💅 Je souhaite réserver :\n' +
      svcs.map(function (s) { return '✨ ' + s.name; }).join('\n') +
      '\n⏱ Durée estimée : ' + fmtDur(dur) +
      '\n👩 Avec : ' + pro.name +
      '\n📅 Le ' + dayLabel() + ' à ' + st.slot +
      '\n👤 ' + name + '\n📞 ' + phone + (note ? '\n📝 ' + note : '')) : '#booking';
  }
  document.getElementById('send').addEventListener('click', function (e) {
    if (this.getAttribute('aria-disabled') !== 'true') return;
    e.preventDefault();
    var target = !chosen().length ? listEl : st.day === null ? dayEl : !st.slot ? slotEl : document.getElementById(val('fname') ? 'fphone' : 'fname');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (target.focus) setTimeout(function () { target.focus({ preventScroll: true }); }, 400);
  });
  render();
}
