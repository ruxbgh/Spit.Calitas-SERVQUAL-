/* Aplicația studentului: Spitalul Calitas, studiu de caz SERVQUAL (~60 de minute, individual). */
(function () {
  'use strict';
  var C = window.CALITAS, K = window.CAL, CFG = window.CALITAS_CONFIG || {}, esc = K.esc;
  var KEY = 'calitas_v1_state';
  var app = document.getElementById('app');
  var rail = document.getElementById('rail');
  var timerEl = document.getElementById('timer');

  var MACROS = [
    { t: 'Început', m: 2 }, { t: 'Spitalul', m: 8 }, { t: 'Rolul tău', m: 5 }, { t: 'Așteptări', m: 9 },
    { t: 'Parcursul', m: 13 }, { t: 'Percepții', m: 9 }, { t: 'Rezultatele tale', m: 6 },
    { t: 'Trimitere', m: 2 }
  ];
  var RATING_LABELS = ['Foarte rău', 'Rău', 'Neutru', 'Bine', 'Foarte bine'];
  var DIM_COLORS = { T: '#5d8f8a', F: '#0e5a61', R: '#f4b400', S: '#2c7a57', E: '#b8402f' };

  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }
  function blank() {
    return {
      v: 1, step: 0, started: null,
      student: { nume: '', prenume: '', grupa: '', cod: '' },
      profil: null, exp: zeros(22), per: zeros(22),
      imp: { T: 20, F: 20, R: 20, S: 20, E: 20 }, impTouched: false,
      momente: {}, global: { sat: 0, nps: -1, cuvant: '' },
      dur: { total: 0 }, sent: false, sentAt: null, sentConfirmed: false
    };
  }

  var S = K.store.get(KEY) || blank();
  var lastRendered = null;

  function save() { K.store.set(KEY, S); }
  function getPath(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, p, v) {
    var ks = p.split('.'), last = ks.pop();
    var t = ks.reduce(function (a, k) { return a[k]; }, o);
    t[last] = v;
  }
  function profile() { return S.profil ? K.profileById(S.profil) : null; }
  function fmtMin(m) {
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  }
  function len(s) { return String(s || '').trim().length; }

  /* ---------- Desene mici ---------- */
  var CLOCK = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 4.5V8l2.5 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  function face(v) {
    var c = 23 + (v - 3) * 4.5;
    return '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="12" cy="14" r="1.8" fill="currentColor"/><circle cx="22" cy="14" r="1.8" fill="currentColor"/>' +
      '<path d="M10.5 ' + (v === 3 ? 23 : 23) + ' Q17 ' + c + ' 23.5 23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function hospitalArt() {
    var w = '', x, y;
    for (y = 92; y <= 196; y += 26) {
      for (x = 54; x <= 130; x += 24) w += '<rect x="' + x + '" y="' + y + '" width="14" height="16" rx="2" fill="#9cc8c1"/>';
      for (x = 262; x <= 338; x += 24) w += '<rect x="' + x + '" y="' + y + '" width="14" height="16" rx="2" fill="#9cc8c1"/>';
    }
    for (y = 136; y <= 162; y += 26) for (x = 164; x <= 222; x += 29) w += '<rect x="' + x + '" y="' + y + '" width="14" height="16" rx="2" fill="#9cc8c1"/>';
    return '<svg viewBox="0 0 400 270" aria-hidden="true" preserveAspectRatio="xMidYMax meet">' +
      '<rect x="40" y="78" width="320" height="170" fill="#f7fbfa"/>' +
      '<rect x="40" y="78" width="320" height="6" fill="#0e5a61"/>' +
      '<rect x="148" y="30" width="104" height="218" fill="#ffffff"/>' +
      '<rect x="148" y="30" width="104" height="6" fill="#0e5a61"/>' +
      '<circle cx="200" cy="74" r="22" fill="#fff" stroke="#14292d" stroke-width="3"/>' +
      '<path d="M200 74V60M200 74l11 6" stroke="#14292d" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="164" y="104" width="72" height="20" rx="3" fill="#0e5a61"/>' +
      '<text x="200" y="118.5" text-anchor="middle" font-family="Barlow Semi Condensed, Arial Narrow, Arial" font-weight="700" font-size="12" fill="#fff" letter-spacing="1">CALITAS</text>' +
      w +
      '<rect x="158" y="194" width="84" height="9" rx="2" fill="#f4b400"/>' +
      '<rect x="172" y="203" width="56" height="45" fill="#7fb9b0"/><path d="M200 203v45" stroke="#f7fbfa" stroke-width="2"/>' +
      '<rect x="0" y="246" width="400" height="24" fill="#b7d0c9"/>' +
      '<rect x="0" y="246" width="400" height="3" fill="#a3c2ba"/>' +
      '<g><rect x="16" y="214" width="5" height="34" fill="#6e8f86"/><circle cx="18.5" cy="206" r="18" fill="#7fb59b"/></g>' +
      '<g><rect x="377" y="220" width="5" height="28" fill="#6e8f86"/><circle cx="379.5" cy="212" r="15" fill="#7fb59b"/></g>' +
      '<g transform="translate(258 222)"><rect width="56" height="22" rx="4" fill="#fff" stroke="#14292d" stroke-width="1.5"/><rect x="38" y="4" width="14" height="9" rx="1.5" fill="#9cc8c1"/>' +
      '<rect x="0" y="12" width="56" height="3" fill="#b8402f"/><path d="M17 4v9M12.5 8.5h9" stroke="#b8402f" stroke-width="2.4"/>' +
      '<circle cx="13" cy="23" r="4.5" fill="#14292d"/><circle cx="44" cy="23" r="4.5" fill="#14292d"/></g>' +
      '</svg>';
  }

  /* ---------- Lista ecranelor ---------- */
  function screens() {
    var L = [{ id: 'start', macro: 0 }];
    if (!S.profil) return L;
    var p = profile();
    L.push({ id: 'spital', macro: 1 });
    L.push({ id: 'rol', macro: 2 });
    C.dimensions.forEach(function (d, i) { L.push({ id: 'exp', macro: 3, dim: d.id, di: i }); });
    L.push({ id: 'imp', macro: 3 });
    p.momente.forEach(function (m, i) { L.push({ id: 'mom', macro: 4, idx: i }); });
    L.push({ id: 'fisa', macro: 4 });
    C.dimensions.forEach(function (d, i) { L.push({ id: 'per', macro: 5, dim: d.id, di: i }); });
    L.push({ id: 'glob', macro: 5 });
    L.push({ id: 'rez', macro: 6 });
    L.push({ id: 'send', macro: 7 });
    return L;
  }
  function firstIndex(L, id) { for (var i = 0; i < L.length; i++) if (L[i].id === id) return i; return -1; }
  // Blocare: după începerea parcursului nu se mai modifică așteptările; după rezultate, nici percepțiile.
  function minStep(L) {
    var iRez = firstIndex(L, 'rez'), iMom = firstIndex(L, 'mom');
    if (iRez >= 0 && S.step >= iRez) return iRez;
    if (iMom >= 0 && S.step >= iMom) return iMom;
    return 0;
  }

  /* ---------- Componente ---------- */
  function likert(arr, prefix, mode, dimId) {
    var d = K.dimById[dimId], h = '';
    d.items.forEach(function (n) {
      var it = C.items[n - 1];
      h += '<fieldset class="item" id="it-' + prefix + n + '"><legend><span class="n">' + n + '</span>' + esc(K.itemText(it, mode)) + '</legend>' +
        '<div class="scale" role="radiogroup">';
      for (var v = 1; v <= 5; v++) {
        h += '<label><input type="radio" name="' + prefix + n + '" value="' + v + '" data-arr="' + arr + '" data-i="' + n + '" aria-label="Enunțul ' + n + ', răspuns ' + v + ' din 5"' +
          (S[arr][n - 1] === v ? ' checked' : '') + '><span>' + v + '</span></label>';
      }
      h += '</div></fieldset>';
    });
    return h;
  }
  function answeredCount(arr, dimId) {
    return K.dimById[dimId].items.filter(function (n) { return S[arr][n - 1] > 0; }).length;
  }
  function field(path, label, o) {
    o = o || {};
    var v = getPath(S, path) || '';
    var min = o.min || 0, max = o.max || 0;
    var inp = o.rows === 1
      ? '<input type="text" data-path="' + path + '" value="' + esc(v) + '"' + (max ? ' maxlength="' + max + '"' : '') + ' autocomplete="off">'
      : '<textarea data-path="' + path + '" rows="' + (o.rows || 4) + '"' + (max ? ' maxlength="' + max + '"' : '') + '>' + esc(v) + '</textarea>';
    var cnt = (min || max > 100) ? '<div class="counter' + (len(v) >= min ? ' ok' : '') + '" data-cnt="' + path + '" data-min="' + min + '" data-max="' + max + '">' + cntText(len(v), min, max) + '</div>' : '';
    return '<label class="f" id="f-' + path.replace(/\./g, '-') + '">' + esc(label) + (o.hint ? '<span class="h">' + esc(o.hint) + '</span>' : '') + inp + cnt + '</label>';
  }
  function cntText(n, min, max) {
    if (min && n < min) return n + ' caractere, mai sunt necesare ' + (min - n);
    return n + (max ? ' din ' + max : '') + ' caractere';
  }
  function select(path, label, options, id) {
    var v = getPath(S, path) || '';
    return '<label class="f"' + (id ? ' id="' + id + '"' : '') + '>' + esc(label) +
      '<select data-path="' + path + '"><option value="">Alege…</option>' +
      options.map(function (o) {
        var val = typeof o === 'string' ? o : o.v, txt = typeof o === 'string' ? o : o.t;
        return '<option value="' + esc(val) + '"' + (v === val ? ' selected' : '') + '>' + esc(txt) + '</option>';
      }).join('') + '</select></label>';
  }
  function dimDots(di) {
    var h = '<div class="dimdots" aria-hidden="true">';
    for (var i = 0; i < 5; i++) h += '<i class="' + (i < di ? 'on' : i === di ? 'cur' : '') + '"></i>';
    return h + '</div>';
  }
  function scaleHint() { return '<div class="scalehint" aria-hidden="true"><span>1 = dezacord total</span><span>5 = acord total</span></div>'; }

  /* ---------- Ecrane ---------- */
  var R = {};

  R.start = function () {
    var resumed = S.started ? '<div class="infobox">Ai deja o sesiune începută pe acest dispozitiv. Apasă pe buton și continui de unde ai rămas, sau pornește una nouă din meniul din stânga.</div>' : '';
    return '<section class="cover"><div class="txt"><div class="kicker">Studiu de caz SERVQUAL</div>' +
      '<h1>O zi ca pacient la Spitalul Calitas</h1>' +
      '<p>Intri în rolul unui pacient, treci prin spital de la sosire până la plecare și măsori calitatea serviciilor cu instrumentul SERVQUAL. La final vezi unde a rămas spitalul sub așteptările tale.</p>' +
      '<div class="meta"><span>aproximativ 50 de minute</span><span>individual</span><span>22 de enunțuri, 5 dimensiuni</span></div></div>' +
      '<div class="art">' + hospitalArt() + '<div class="ticket" aria-hidden="true">Bon de ordine<b>047</b>Vă rugăm să așteptați<span class="now">Pe ecran: 029</span></div></div></section>' +
      resumed +
      '<div class="card"><h2>Cum decurge</h2><ol class="howto">' +
      '<li>Citești prezentarea spitalului și afli ce pacient ești.</li>' +
      '<li>Spui ce aștepți de la un spital excelent, înainte să vezi ce urmează.</li>' +
      '<li>Treci prin ziua pacientului, moment cu moment.</li>' +
      '<li>Evaluezi spitalul pe cele 22 de enunțuri.</li>' +
      '<li>Îți vezi rezultatele și le trimiți profesorului.</li></ol>' +
      '<p class="small muted" style="margin:0">' + (K.profileById(CFG.profilFix) ? 'Toți colegii tăi intră în rolul aceluiași pacient, dar fiecare răspunde singur, din propria perspectivă.' : 'Fiecare student primește alt pacient, în funcție de nume.') + ' Profesorul vede răspunsurile tale cu numele tău; în clasă rezultatele se prezintă agregat. Toate cazurile sunt fictive, nu introduce date de sănătate reale.</p></div>' +
      '<div class="card signed"><h2>Datele tale</h2><div class="row2">' +
      field('student.nume', 'Nume', { rows: 1, max: 60 }) + field('student.prenume', 'Prenume', { rows: 1, max: 60 }) + '</div>' +
      field('student.grupa', 'Grupă sau serie', { rows: 1, max: 30, hint: 'De exemplu: MBA 1, grupa 3' }) +
      (CFG.cerCodSesiune ? field('student.cod', 'Cod de sesiune', { rows: 1, max: 30, hint: 'Îl primești de la profesor' }) : '') + '</div>';
  };

  R.spital = function () {
    var H = C.spital;
    return '<div class="hero"><svg class="cross" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="8" fill="#fff"/><path d="M16 7h8v9h9v8h-9v9h-8v-9H7v-8h9z" fill="#0e5a61"/></svg>' +
      '<div class="kicker">' + esc(H.sub) + '</div><h1>' + esc(H.nume) + '</h1>' +
      '<p>' + esc(H.despre[0]) + '</p><p class="motto">' + esc(H.motto) + '</p></div>' +
      '<div class="stats">' + H.cifre.map(function (c) { return '<div class="stat"><b>' + esc(c.v) + '</b><span>' + esc(c.l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="card"><h2>Misiune și valori</h2><p class="lead">' + esc(H.misiune) + '</p><div class="values">' +
      H.valori.map(function (v) { return '<div><b>' + esc(v.t) + '</b>' + esc(v.d) + '</div>'; }).join('') + '</div></div>' +
      '<div class="card"><h2>Ce găsești în spital</h2><ul class="chips">' + H.structuri.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<p style="margin-top:16px">' + esc(H.context) + '</p><p class="small muted" style="margin:0">' + esc(H.despre[1]) + '</p></div>' +
      '<div class="board"><div class="kicker" style="text-align:center">Afișată la intrare și pe site</div><h2 style="text-align:center">Cartea promisiunilor către pacienți</h2>' +
      '<p style="margin:0 auto 12px;text-align:center">Acestea sunt angajamentele publice ale spitalului. Ține-le minte: mai târziu vei compara ce s-a promis cu ce s-a întâmplat.</p>' +
      '<ol class="charta">' + H.promisiuni.map(function (p) { return '<li><span>' + esc(p) + '</span></li>'; }).join('') + '</ol></div>';
  };

  R.rol = function () {
    var p = profile(), pe = p.persona;
    return '<div class="kicker">Rolul tău în următoarea oră</div>' +
      '<div class="band" role="group" aria-label="Brățara de identificare a pacientului"><div class="end l"></div>' +
      '<div class="face"><div class="avatar" aria-hidden="true">' + esc(pe.initiale) + '</div><div><h1>' + esc(pe.nume) + '</h1>' +
      '<div class="facts"><span><b>' + pe.varsta + '</b> de ani</span><span>' + esc(pe.rol) + '</span><span>' + esc(pe.loc) + '</span></div></div></div>' +
      '<div class="code"><div class="barcode"></div><small>' + esc(K.studentId(S.student).slice(1, 9).toUpperCase()) + '</small></div><div class="end r"></div></div>' +
      '<div class="card signed"><span class="tag low" style="margin-bottom:12px">' + esc(p.eticheta) + '</span><h2>Situația ta</h2><p class="situatie">' + esc(p.intro) + '</p>' +
      '<div class="infobox">De acum gândești ca ' + esc(pe.nume) + ', nu ca student la management. Contează ce te doare, ce te îngrijorează și cât timp ai la dispoziție.</div>' +
      '<div class="thought"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#f4b400"/><path d="M15 15a5 5 0 1 1 7 4.6c-1.4.6-2 1.4-2 2.9V24" fill="none" stroke="#14292d" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="29.5" r="2" fill="#14292d"/></svg>' +
      '<div><b>Înainte să mergi mai departe:</b> ce ai vrea să găsești, în situația ta, într-un spital excelent? În pasul următor notezi exact asta, înainte să afli ce se întâmplă la Calitas.</div></div></div>';
  };

  R.exp = function (sc) {
    var d = K.dimById[sc.dim], pe = profile().persona;
    var first = sc.di === 0 ? '<div class="infobox">Nu există răspunsuri corecte sau greșite. Răspunzi despre <b>un spital excelent</b> în general, nu despre Spitalul Calitas.</div>' : '';
    return '<div class="card signed"><div class="dimhead"><div class="kicker">Așteptări, dimensiunea ' + (sc.di + 1) + ' din 5</div>' + dimDots(sc.di) + '</div>' +
      '<h2>' + esc(d.nume) + '</h2><p class="muted" style="margin-bottom:6px">' + esc(d.desc) + '</p>' +
      '<div class="modepill a">Ce aștepți, ca ' + esc(pe.nume) + ', de la un spital excelent</div>' + first +
      '<p class="progress-line" data-prog="exp:' + sc.dim + '">' + answeredCount('exp', sc.dim) + ' din ' + d.items.length + ' enunțuri completate</p>' + scaleHint() +
      likert('exp', 'e', 'A', sc.dim) + '</div>';
  };

  R.imp = function () {
    var h = '<div class="card signed"><div class="kicker">Importanță</div><h2>Ce contează cel mai mult pentru tine?</h2>' +
      '<p>Împarte 100 de puncte între cele 5 dimensiuni, după cât de importante sunt pentru tine în situația ta. Suma trebuie să fie exact 100.</p>';
    C.dimensions.forEach(function (d) {
      h += '<div class="imp"><b>' + esc(d.nume) + '</b><span class="val" id="iv-' + d.id + '">' + S.imp[d.id] + '</span>' +
        '<input type="range" min="0" max="100" step="5" value="' + S.imp[d.id] + '" data-imp="' + d.id + '" aria-label="Importanța dimensiunii ' + esc(d.nume) + '">' +
        '<span class="d">' + esc(d.desc) + '</span></div>';
    });
    return h + '<div class="impbar" id="impbar" aria-hidden="true"></div><div class="imp-total" id="imp-total"></div></div>';
  };

  R.mom = function (sc) {
    var p = profile(), m = p.momente[sc.idx], n = p.momente.length;
    var st = S.momente[m.id] || { r: 0, n: '' };
    var tot = m.asteptare + m.serviciu;
    var journey = '<div class="journey" aria-hidden="true">' + p.momente.map(function (x, i) {
      return '<span class="' + (i < sc.idx ? 'done' : i === sc.idx ? 'cur' : '') + '">' + esc(x.titlu) + '</span>';
    }).join('') + '</div>';
    var strip = tot ? '<div class="waitstrip"><div class="big">' + (m.asteptare ? fmtMin(m.asteptare) + '<small>așteptare</small>' : fmtMin(m.serviciu) + '<small>îngrijire efectivă</small>') + '</div><div>' +
      '<div class="mini-bar">' + (m.asteptare ? '<div class="seg w" style="width:' + (m.asteptare / tot * 100) + '%"></div>' : '') + (m.serviciu ? '<div class="seg s" style="width:' + (m.serviciu / tot * 100) + '%"></div>' : '') + '</div>' +
      (m.asteptare && m.serviciu ? '<p class="small muted" style="margin:6px 0 0">Urmată de ' + fmtMin(m.serviciu) + ' de îngrijire efectivă.</p>' : '') + '</div></div>' : '';
    var h = '<div class="card signed moment">' + journey + '<div class="kicker">Momentul ' + (sc.idx + 1) + ' din ' + n + ' din ziua lui ' + esc(p.persona.nume) + '</div>' +
      '<div class="mhead"><span class="ora">' + CLOCK + esc(m.ora) + '</span><h2 style="margin:0">' + esc(m.titlu) + '</h2></div>' +
      '<p class="lead">' + esc(m.text) + '</p>' + strip +
      (m.promis ? '<div class="promis"><span class="pin" aria-hidden="true">!</span><div><b>Ce promite spitalul</b>' + esc(m.promis) + '</div></div>' : '') +
      '<div id="rate-' + m.id + '"><h3 style="margin-top:18px">Cum te simți în acest moment?</h3><div class="rating" role="radiogroup">';
    for (var v = 1; v <= 5; v++) {
      h += '<label><input type="radio" name="r-' + m.id + '" value="' + v + '" data-mom="' + m.id + '"' + (st.r === v ? ' checked' : '') + ' aria-label="' + RATING_LABELS[v - 1] + '"><span>' + face(v) + RATING_LABELS[v - 1] + '</span></label>';
    }
    h += '</div></div><label class="f" style="margin-top:18px">Ce ai observat? Ce te-a deranjat sau te-a liniștit? <span class="h">Opțional, o propoziție sau două</span>' +
      '<textarea rows="3" data-momnote="' + m.id + '" maxlength="400">' + esc(st.n) + '</textarea></label></div>';
    return h;
  };

  function rchip(r) { return r ? '<span class="rchip" style="' + K.heat5(r) + '">' + r + '</span>' : '–'; }

  R.fisa = function () {
    var p = profile(), W = 0, Sv = 0, segs = '', rows = '', mean = [];
    p.momente.forEach(function (m) { W += m.asteptare; Sv += m.serviciu; });
    var T = W + Sv;
    p.momente.forEach(function (m) {
      if (m.asteptare) segs += '<div class="seg w" style="width:' + (m.asteptare / T * 100) + '%" title="' + esc(m.titlu) + ': așteptare ' + fmtMin(m.asteptare) + '"></div>';
      if (m.serviciu) segs += '<div class="seg s" style="width:' + (m.serviciu / T * 100) + '%" title="' + esc(m.titlu) + ': îngrijire ' + fmtMin(m.serviciu) + '"></div>';
      var r = (S.momente[m.id] || {}).r || 0; if (r) mean.push(r);
      rows += '<tr><td>' + esc(m.ora) + '</td><td>' + esc(m.titlu) + '</td><td class="num">' + (m.asteptare ? fmtMin(m.asteptare) : '–') + '</td><td class="num">' + (m.serviciu ? fmtMin(m.serviciu) : '–') + '</td><td class="num">' + rchip(r) + '</td></tr>';
    });
    return '<div class="card signed"><div class="kicker">Fișa de parcurs</div><h2>Unde s-a dus timpul tău la spital</h2>' +
      '<p>Ziua lui ' + esc(p.persona.nume) + ' în cifre: ' + fmtMin(T) + ' petrecute în spital.</p>' +
      '<div class="split"><div class="w"><b>' + fmtMin(W) + '</b><span>așteptare (' + Math.round(W / T * 100) + '% din timp)</span></div><div class="s"><b>' + fmtMin(Sv) + '</b><span>îngrijire efectivă (' + Math.round(Sv / T * 100) + '% din timp)</span></div></div>' +
      '<div class="fisa"><div class="track">' + segs + '</div><p style="margin-top:8px"><span class="lg legend-w">Așteptare</span><span class="lg legend-s">Îngrijire efectivă</span></p>' +
      '<div class="tblwrap"><table class="tbl"><thead><tr><th>Ora</th><th>Moment</th><th class="num">Așteptare</th><th class="num">Îngrijire</th><th class="num">Cum te-ai simțit</th></tr></thead><tbody>' + rows +
      '<tr><th colspan="2">Total</th><th class="num">' + fmtMin(W) + '</th><th class="num">' + fmtMin(Sv) + '</th><th class="num">' + (mean.length ? K.fmt(K.mean(mean), 1) : '–') + '</th></tr></tbody></table></div></div>' +
      '<div class="infobox" style="margin:0">Acum ai toate datele. În etapa următoare evaluezi spitalul pe aceleași 22 de enunțuri, de data aceasta pe baza a ceea ce ai trăit.</div></div>';
  };

  R.per = function (sc) {
    var d = K.dimById[sc.dim], p = profile(), pe = p.persona;
    var recap = '<details style="margin:0 0 14px"><summary style="cursor:pointer;font-weight:700;color:var(--sign)">Recitește ziua lui ' + esc(pe.nume) + '</summary><div style="margin-top:10px">' +
      p.momente.map(function (m) { return '<p><b>' + esc(m.ora) + ', ' + esc(m.titlu) + '.</b> ' + esc(m.text) + '</p>'; }).join('') + '</div></details>';
    var first = sc.di === 0 ? '<div class="infobox">Scala este aceeași, dar acum răspunzi despre <b>Spitalul Calitas</b>, pe baza a ce ai trăit.</div>' : '';
    return '<div class="card signed"><div class="dimhead"><div class="kicker">Percepții, dimensiunea ' + (sc.di + 1) + ' din 5</div>' + dimDots(sc.di) + '</div>' +
      '<h2>' + esc(d.nume) + '</h2><p class="muted" style="margin-bottom:6px">' + esc(d.desc) + '</p>' +
      '<div class="modepill p">Ce ai trăit la Spitalul Calitas</div>' + first + recap +
      '<p class="progress-line" data-prog="per:' + sc.dim + '">' + answeredCount('per', sc.dim) + ' din ' + d.items.length + ' enunțuri completate</p>' + scaleHint() +
      likert('per', 'p', 'P', sc.dim) + '</div>';
  };

  R.glob = function () {
    var g = S.global, h = '<div class="card signed"><div class="kicker">Impresie generală</div><h2>Două întrebări despre experiența ta</h2>' +
      '<fieldset class="item" id="it-sat"><legend>În ansamblu, cât de mulțumit sau mulțumită ești de experiența ta la Spitalul Calitas?</legend><div class="scale" role="radiogroup">';
    for (var v = 1; v <= 5; v++) h += '<label><input type="radio" name="sat" value="' + v + '" data-glob="sat"' + (g.sat === v ? ' checked' : '') + ' aria-label="Mulțumire ' + v + ' din 5"><span>' + v + '</span></label>';
    h += '</div><p class="small muted" style="margin:8px 0 0">1 = foarte nemulțumit, 5 = foarte mulțumit</p></fieldset>' +
      '<fieldset class="item" id="it-nps"><legend>Cât de probabil este să recomanzi Spitalul Calitas unui prieten sau unei rude aflate în situația ta?</legend><div class="scale nps" role="radiogroup">';
    for (v = 0; v <= 10; v++) h += '<label><input type="radio" name="nps" value="' + v + '" data-glob="nps"' + (g.nps === v ? ' checked' : '') + ' aria-label="Recomandare ' + v + ' din 10"><span>' + v + '</span></label>';
    h += '</div><p class="small muted" style="margin:8px 0 0">0 = deloc probabil, 10 = foarte probabil</p></fieldset>' +
      '<div style="margin-top:14px">' + field('global.cuvant', 'Un cuvânt sau o expresie care descrie experiența ta', { rows: 1, max: 60, hint: 'Opțional' }) + '</div></div>';
    return h;
  };

  function gauge(v) {
    var pos = Math.max(0, Math.min(100, (v + 4) / 8 * 100));
    return '<div class="gauge" aria-hidden="true"><div class="bar"><div class="mk" style="left:' + pos + '%"></div></div><div class="ticks"><span>−4</span><span>−2</span><span>0</span><span>+2</span><span>+4</span></div></div>';
  }

  R.rez = function () {
    var a = K.analyze(S), b = K.band(a.ipcs), pe = profile().persona;
    var series = [{ name: 'Așteptări', cls: 'a', v: a.A }, { name: 'Percepții', cls: 'p', v: a.P }];
    var rows = C.dimensions.map(function (d) {
      var bd = K.band(a.gap[d.id]);
      return '<tr><td><b>' + esc(d.nume) + '</b></td><td class="num">' + K.fmt(a.A[d.id]) + '</td><td class="num">' + K.fmt(a.P[d.id]) + '</td><td class="num" style="' + K.heat(a.gap[d.id]) + '"><b>' + K.fmtS(a.gap[d.id]) + '</b></td><td class="num">' + S.imp[d.id] + '</td><td><span class="tag ' + bd.k + '">' + esc(bd.t) + '</span></td></tr>';
    }).join('');
    var order = a.itemGap.map(function (g, i) { return { n: i + 1, g: g }; }).sort(function (x, y) { return x.g - y.g; });
    var worst = order.filter(function (o) { return o.g < 0; }).slice(0, 3);
    var best = order.slice().reverse().filter(function (o) { return o.g >= 0; }).slice(0, 2);
    var li = function (o) {
      return '<li><span class="g ' + (o.g < 0 ? 'neg' : 'pos') + '">' + K.fmtS(o.g, 0) + '</span><div>' + esc(K.itemText(C.items[o.n - 1], 'P')) +
        '<br><span class="muted small">Așteptare ' + S.exp[o.n - 1] + ', percepție ' + S.per[o.n - 1] + ', dimensiunea ' + esc(K.dimById[C.items[o.n - 1].d].nume) + '</span></div></li>';
    };
    var worstD = C.dimensions.slice().sort(function (x, y) { return a.gap[x.id] - a.gap[y.id]; })[0];
    var text = a.ipcs >= 0
      ? 'În ansamblu, spitalul a atins sau a depășit ce te așteptai.'
      : 'În ansamblu, experiența ta a rămas sub așteptări. Cea mai mare discrepanță este la <b>' + esc(worstD.nume) + '</b> (' + K.fmtS(a.gap[worstD.id]) + ').';
    return '<div class="card signed"><div class="kicker">Rezultatele lui ' + esc(pe.nume) + '</div><h2>Calitatea percepută la Spitalul Calitas</h2>' +
      '<div class="res-grid"><div><p class="muted" style="margin:0">Indicele de măsurare a percepției calității serviciului (IPCS)</p>' +
      '<div class="bignum ' + (a.ipcs < 0 ? 'neg' : 'pos') + '">' + K.fmtS(a.ipcs) + '</div><span class="tag ' + b.k + '">' + esc(b.t) + '</span>' + gauge(a.ipcs) +
      '<p>' + text + '</p><p class="small muted" style="margin:0">IPCS ponderat cu importanța ta: <b>' + K.fmtS(a.ipcsW) + '</b>. Grad de satisfacție (P/A): <b>' + K.fmt(a.sat, 0) + '%</b>.</p></div>' +
      '<div>' + K.radar(series) + '</div></div></div>' +
      '<div class="card"><h3>Pe dimensiuni</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Dimensiune</th><th class="num">Așteptări (A)</th><th class="num">Percepții (P)</th><th class="num">P − A</th><th class="num">Importanță</th><th>Interpretare</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<details style="margin-top:14px"><summary style="cursor:pointer;color:var(--sign);font-weight:700">Cum se calculează</summary><p class="small" style="margin-top:8px">Pentru fiecare dimensiune se face media răspunsurilor la enunțurile ei, separat pentru așteptări (A) și percepții (P). Discrepanța este P − A. IPCS este media discrepanțelor celor 5 dimensiuni; un număr negativ arată că experiența a fost sub așteptări. Varianta ponderată înmulțește fiecare discrepanță cu importanța pe care ai dat-o dimensiunii.</p></details></div>' +
      '<div class="card"><h3>Unde a rămas spitalul cel mai mult sub așteptările tale</h3>' +
      (worst.length ? '<ol class="gaplist">' + worst.map(li).join('') + '</ol>' : '<p>Nu ai niciun enunț cu percepția sub așteptare.</p>') +
      (best.length ? '<h3 style="margin-top:22px">Unde ți-a răspuns la așteptări</h3><ol class="gaplist">' + best.map(li).join('') + '</ol>' : '') + '</div>' +
      '<div class="infobox">Aceste rezultate reflectă experiența unui singur pacient. Profesorul le va compara cu ale colegilor, care au trăit alte situații la același spital. De aici înainte răspunsurile la chestionar nu mai pot fi modificate.</div>';
  };


  R.send = function () {
    var pe = profile().persona, miss = firstMissing();
    var mins = Math.round((S.dur.total || 0) / 60);
    var h = '<div class="card signed"><div class="kicker">Ultimul pas</div><h2>Trimite rezultatele profesorului</h2>' +
      '<p><b>' + esc(S.student.prenume + ' ' + S.student.nume) + '</b>, ' + esc(S.student.grupa) + '. Ai fost ' + esc(pe.nume) + '. Timp activ: ' + mins + ' minute.</p>';
    if (miss) {
      return h + '<div class="alertbox">Mai ai de completat: <b>' + esc(miss.msg) + '</b> <button class="btn small" data-goto="' + miss.step + '" style="margin-left:8px">Mergi acolo</button></div></div>';
    }
    var code = K.encodeCode(payload());
    var steps = '<ol class="sendsteps">' +
      '<li><b>Copiază codul tău de rezultat.</b> Conține numele tău și toate răspunsurile.' +
      '<textarea class="codebox" id="codebox" readonly rows="3" aria-label="Codul tău de rezultat">' + esc(code) + '</textarea>' +
      '<button class="btn primary" id="btn-copy">Copiază codul</button> <span class="copied" id="copied" role="status"></span></li>' +
      '<li><b>Lipește-l în formularul profesorului.</b> ' + (CFG.linkFormular
        ? 'Formularul are o singură întrebare: codul.<br><a class="btn go" id="btn-form" href="' + esc(CFG.linkFormular) + '" target="_blank" rel="noopener">Deschide formularul</a>'
        : 'Profesorul îți spune unde: formular, e-mail sau platforma facultății.') + '</li></ol>';
    if (CFG.endpoint) {
      if (S.sent && S.sentConfirmed) {
        h += '<div class="sentok"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36" fill="#def1e6"/><path d="M24 41l11 11 21-24" fill="none" stroke="#2c7a57" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg><div><b>Rezultatele tale au ajuns la profesor.</b><br><span class="muted small">Trimise la ' + esc(S.sentAt || '') + '. Nu mai trebuie să faci nimic.</span></div></div>';
      } else {
        h += '<p>Apasă butonul de mai jos: rezultatele ajung direct la profesor.</p><button class="btn go big" id="btn-send">Trimite rezultatele</button>' +
          (S.sent ? '<div class="waitbox" style="margin-top:14px">Trimiterea nu a fost confirmată. Încearcă din nou sau folosește codul de mai jos.</div>' : '');
      }
      h += '<p class="status" id="status" role="status"></p>' +
        '<details class="fallback"' + (S.sent && !S.sentConfirmed ? ' open' : '') + '><summary>Nu merge trimiterea? Folosește codul de rezultat</summary>' + steps + '</details>';
    } else {
      h += steps;
    }
    h += '<p class="small muted" style="margin:14px 0 0">Altă variantă: <a href="#" id="btn-dl">descarcă fișierul cu rezultate</a> sau <a href="#" id="btn-print">tipărește pagina</a>.</p>' +
      (CFG.endpoint ? '' : '<p class="status" id="status" role="status"></p>') + '</div>' +
      ((CFG.endpoint && !(S.sent && S.sentConfirmed)) ? '' : '<div class="card done-card"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36" fill="#def1e6"/><path d="M24 41l11 11 21-24" fill="none" stroke="#2c7a57" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<h2>Mulțumim, ' + esc(S.student.prenume) + '!</h2><p style="margin:0 auto">După ce trimite toată grupa, profesorul vă arată concluziile SERVQUAL pentru Spitalul Calitas.</p></div>');
    return h;
  };

  /* ---------- Validare ---------- */
  function validate(sc) {
    var msgs = [], miss = [];
    function need(ok, msg, id) { if (!ok) { msgs.push(msg); if (id) miss.push(id); } }
    switch (sc.id) {
      case 'start':
        need(len(S.student.nume) >= 2, 'Completează numele.', 'f-student-nume');
        need(len(S.student.prenume) >= 2, 'Completează prenumele.', 'f-student-prenume');
        need(len(S.student.grupa) >= 1, 'Completează grupa.', 'f-student-grupa');
        if (CFG.cerCodSesiune) need(len(S.student.cod) >= 1, 'Introdu codul de sesiune.', 'f-student-cod');
        break;
      case 'exp': case 'per':
        var arr = sc.id, pre = sc.id === 'exp' ? 'e' : 'p', cnt = 0;
        K.dimById[sc.dim].items.forEach(function (n) { if (!S[arr][n - 1]) { cnt++; miss.push('it-' + pre + n); } });
        if (cnt) msgs.push(cnt === 1 ? 'Mai ai un enunț fără răspuns (marcat cu roșu).' : 'Mai ai ' + cnt + ' enunțuri fără răspuns (marcate cu roșu).');
        break;
      case 'imp':
        var sum = 0; K.ids.forEach(function (k) { sum += S.imp[k]; });
        need(sum === 100, 'Suma punctelor trebuie să fie exact 100 (acum: ' + sum + ').');
        need(S.impTouched, 'Confirmă distribuția mutând cel puțin un cursor (poți reveni apoi la valoarea dorită).');
        break;
      case 'mom':
        var m = profile().momente[sc.idx];
        need(((S.momente[m.id] || {}).r || 0) > 0, 'Alege cum te-ai simțit în acest moment.', 'rate-' + m.id);
        break;
      case 'glob':
        need(S.global.sat > 0, 'Alege nivelul de mulțumire.', 'it-sat');
        need(S.global.nps >= 0, 'Alege probabilitatea de recomandare.', 'it-nps');
        break;
    }
    return { ok: msgs.length === 0, msgs: msgs, miss: miss };
  }
  function firstMissing() {
    var L = screens();
    for (var i = 0; i < L.length; i++) {
      if (L[i].id === 'send') continue;
      var v = validate(L[i]);
      if (!v.ok) return { step: i, msg: MACROS[L[i].macro].t + ': ' + v.msgs[0] };
    }
    return null;
  }

  /* ---------- Randare ---------- */
  function navHtml(L, sc) {
    var back = S.step > minStep(L) && sc.id !== 'start';
    var lastMom = profile() ? profile().momente.length - 1 : 0;
    var labels = {
      start: S.started ? 'Continuă' : 'Începe studiul de caz', spital: 'Am citit, mai departe', rol: 'Notează așteptările', exp: sc.di === 4 ? 'Continuă la importanță' : 'Dimensiunea următoare',
      imp: 'Intră în spital', mom: sc.idx === lastMom ? 'Vezi fișa de parcurs' : 'Momentul următor',
      fisa: 'Evaluează spitalul', per: sc.di === 4 ? 'Continuă' : 'Dimensiunea următoare', glob: 'Vezi rezultatele mele',
      rez: 'Treci la trimitere'
    };
    var warn = (sc.id === 'imp') ? '<p class="small muted" style="flex-basis:100%;margin:0;text-align:right">După acest pas, așteptările nu mai pot fi modificate.</p>'
      : (sc.id === 'glob') ? '<p class="small muted" style="flex-basis:100%;margin:0;text-align:right">După acest pas, percepțiile nu mai pot fi modificate.</p>' : '';
    var h = '<div class="nav"><div id="navmsg" class="msg" role="alert"></div>';
    h += back ? '<button class="btn" id="btn-back">Înapoi</button>' : '<span></span>';
    if (sc.id !== 'send') h += '<button class="btn ' + (sc.id === 'start' ? 'go' : 'primary') + '" id="btn-next">' + esc(labels[sc.id] || 'Continuă') + '</button>';
    return h + warn + '</div>';
  }

  function render(keepScroll) {
    var L = screens();
    if (S.step >= L.length) S.step = L.length - 1;
    var sc = L[S.step];
    app.innerHTML = R[sc.id](sc) + navHtml(L, sc);
    lastRendered = sc;
    if (sc.id === 'imp') updateImpTotal();
    renderRail(L, sc);
    if (!keepScroll) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    save();
  }

  function renderRail(L, sc) {
    var cur = sc.macro, pe = S.profil ? profile().persona : null;
    var h = '<ol>' + MACROS.map(function (m, i) {
      return '<li class="' + (i < cur ? 'done' : i === cur ? 'cur' : '') + '"' + (i === cur ? ' aria-current="step"' : '') + '>' + esc(m.t) + '<small>' + m.m + ' min</small></li>';
    }).join('') + '</ol>';
    if (pe) h += '<div class="who"><span class="muted">Rolul tău</span><b>' + esc(pe.nume) + '</b>' + esc(profile().eticheta) + '</div>';
    if (S.started) h += '<p class="reset"><a href="#" id="btn-reset">Student nou sau reia de la zero</a></p>';
    rail.innerHTML = h;
    var pct = Math.round(S.step / Math.max(L.length - 1, 1) * 100);
    var mp = document.getElementById('mprog');
    if (!mp) { mp = document.createElement('div'); mp.id = 'mprog'; mp.className = 'mobile-prog'; app.parentNode.insertBefore(mp, app); }
    mp.innerHTML = '<div class="bar"><i style="width:' + pct + '%"></i></div><p>Etapa ' + (cur + 1) + ' din ' + MACROS.length + ': ' + esc(MACROS[cur].t) + '</p>';
  }

  /* ---------- Cronometru ---------- */
  function showTime() {
    var s = S.dur.total || 0, mm = Math.floor(s / 60), ss = s % 60;
    timerEl.firstChild.nodeValue = (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
  }
  setInterval(function () {
    if (!S.started || (S.sent && lastRendered && lastRendered.id === 'send')) return;
    if (document.visibilityState !== 'visible') return;
    S.dur.total = (S.dur.total || 0) + 1;
    var mk = 'm' + (lastRendered ? lastRendered.macro : 0);
    S.dur[mk] = (S.dur[mk] || 0) + 1;
    showTime();
    if (S.dur.total % 15 === 0) save();
  }, 1000);

  /* ---------- Evenimente ---------- */
  function updateImpTotal() {
    var sum = 0; K.ids.forEach(function (k) { sum += S.imp[k]; });
    var el = document.getElementById('imp-total'), bar = document.getElementById('impbar');
    if (bar) bar.innerHTML = C.dimensions.map(function (d) { return S.imp[d.id] ? '<i style="width:' + (S.imp[d.id] / Math.max(sum, 100) * 100) + '%;background:' + DIM_COLORS[d.id] + '" title="' + esc(d.nume) + '"></i>' : ''; }).join('');
    if (!el) return;
    el.className = 'imp-total ' + (sum === 100 ? 'ok' : 'bad');
    el.textContent = 'Total: ' + sum + ' din 100' + (sum === 100 ? '. Perfect.' : sum > 100 ? '. Ai depășit cu ' + (sum - 100) + '.' : '. Mai ai ' + (100 - sum) + ' de împărțit.');
  }

  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[data-arr]')) {
      S[t.dataset.arr][+t.dataset.i - 1] = +t.value;
      var fs = t.closest('fieldset'); if (fs) fs.classList.remove('miss');
      var sc = lastRendered, prog = app.querySelector('[data-prog]');
      if (prog && sc) prog.textContent = answeredCount(sc.id, sc.dim) + ' din ' + K.dimById[sc.dim].items.length + ' enunțuri completate';
    } else if (t.matches('input[data-mom]')) {
      var id = t.dataset.mom; S.momente[id] = S.momente[id] || { r: 0, n: '' };
      S.momente[id].r = +t.value;
      var box = document.getElementById('rate-' + id); if (box) box.classList.remove('miss');
    } else if (t.matches('input[data-glob]')) {
      S.global[t.dataset.glob] = +t.value;
      var f2 = t.closest('fieldset'); if (f2) f2.classList.remove('miss');
    } else if (t.matches('select[data-path]')) {
      setPath(S, t.dataset.path, t.value);
    }
    save();
  });

  app.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('[data-path]') && t.tagName !== 'SELECT') {
      setPath(S, t.dataset.path, t.value);
      var c = app.querySelector('[data-cnt="' + t.dataset.path + '"]');
      if (c) {
        var min = +c.dataset.min, max = +c.dataset.max, n = len(t.value);
        c.textContent = cntText(n, min, max);
        c.classList.toggle('ok', n >= min);
      }
    } else if (t.matches('[data-momnote]')) {
      var id = t.dataset.momnote; S.momente[id] = S.momente[id] || { r: 0, n: '' };
      S.momente[id].n = t.value;
    } else if (t.matches('input[data-imp]')) {
      S.imp[t.dataset.imp] = +t.value; S.impTouched = true;
      var lab = document.getElementById('iv-' + t.dataset.imp); if (lab) lab.textContent = t.value;
      updateImpTotal();
    }
    save();
  });

  function goNext() {
    var L = screens(), sc = L[S.step], v = validate(sc);
    var nm = document.getElementById('navmsg');
    if (!v.ok) {
      if (nm) nm.innerHTML = '<div class="alertbox"><b>Mai ai de completat:</b><ul>' + v.msgs.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
      v.miss.forEach(function (id) { var el = document.getElementById(id); if (el) el.classList.add('miss'); });
      var first = v.miss.length ? document.getElementById(v.miss[0]) : null;
      (first || nm || app).scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (sc.id === 'start') {
      if (!S.profil) {
        var forced = (new URLSearchParams(location.search)).get('profil');
        S.profil = K.profileById(forced) ? forced : K.profileById(CFG.profilFix) ? CFG.profilFix : K.pickProfile(S.student);
      }
      if (!S.started) S.started = Date.now();
      L = screens();
    }
    S.step = Math.min(S.step + 1, L.length - 1);
    render();
  }

  app.addEventListener('click', function (e) {
    var t = e.target.closest('button, a#btn-dl, a#btn-print');
    if (!t) return;
    if (t.tagName === 'A') e.preventDefault();
    if (t.id === 'btn-next') goNext();
    else if (t.id === 'btn-back') { S.step = Math.max(S.step - 1, minStep(screens())); render(); }
    else if (t.dataset.goto) { S.step = +t.dataset.goto; render(); }
    else if (t.id === 'btn-dl') downloadCopy();
    else if (t.id === 'btn-print') window.print();
    else if (t.id === 'btn-send') send();
    else if (t.id === 'btn-copy') copyCode();
  });

  rail.addEventListener('click', function (e) {
    if (e.target.id === 'btn-reset') {
      e.preventDefault();
      if (confirm('Pornești o sesiune nouă? Răspunsurile salvate pe acest dispozitiv vor fi șterse (ce ai trimis deja rămâne la profesor).')) {
        K.store.del(KEY); S = blank(); showTime(); render();
      }
    }
  });

  /* ---------- Trimitere ---------- */
  function payload() {
    var a = K.analyze(S);
    return {
      v: 1, id: K.studentId(S.student), ts: new Date().toISOString(),
      student: { nume: S.student.nume.trim(), prenume: S.student.prenume.trim(), grupa: S.student.grupa.trim() },
      cod: S.student.cod || '', profil: S.profil, exp: S.exp, per: S.per, imp: S.imp,
      momente: S.momente, global: S.global,
      dur: S.dur, rez: { ipcs: a.ipcs, ipcsW: a.ipcsW, sat: a.sat }, versiune: C.versiune
    };
  }
  function payloadWithCode() { var p = payload(); p.code = K.encodeCode(p); return p; }
  function copyCode() {
    var box = document.getElementById('codebox'), note = document.getElementById('copied');
    var done = function () { if (note) note.textContent = 'Copiat. Acum lipește-l în formular.'; };
    box.focus(); box.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(box.value).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) { if (note) note.textContent = 'Selectează codul și copiază-l cu Ctrl+C.'; } });
    } else { try { document.execCommand('copy'); done(); } catch (e) { if (note) note.textContent = 'Selectează codul și copiază-l cu Ctrl+C.'; } }
  }
  function setStatus(msg) { var el = document.getElementById('status'); if (el) el.textContent = msg; }
  function downloadCopy() {
    var p = payload();
    K.download('calitas_' + K.norm(p.student.nume).replace(/\s+/g, '-') + '_' + K.norm(p.student.prenume).replace(/\s+/g, '-') + '.json', JSON.stringify(p, null, 1), 'application/json');
    setStatus('Fișierul a fost descărcat. Trimite-l profesorului.');
  }
  function markSent(confirmed) {
    S.sent = true; S.sentConfirmed = confirmed; S.sentAt = new Date().toLocaleString('ro-RO'); save(); render(true);
  }
  function send() {
    if (firstMissing()) { render(true); return; }
    var body = JSON.stringify(payloadWithCode()), btn = document.getElementById('btn-send');
    if (btn) btn.disabled = true;
    setStatus('Se trimite…');
    fetch(CFG.endpoint, { method: 'POST', body: body, redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok) { markSent(true); }
        else { if (btn) btn.disabled = false; setStatus('Serverul a respins trimiterea: ' + ((j && j.error) || 'motiv necunoscut') + '. Descarcă fișierul și trimite-l profesorului.'); }
      })
      .catch(function () {
        fetch(CFG.endpoint, { method: 'POST', body: body, mode: 'no-cors' })
          .then(function () { markSent(false); })
          .catch(function () { if (btn) btn.disabled = false; setStatus('Nu s-a putut trimite. Descarcă fișierul și trimite-l profesorului.'); });
      });
  }

  /* ---------- Pornire ---------- */
  if (S.started) showTime();
  render();
})();
