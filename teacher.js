/* Zona profesorului: agregare și prezentarea rezultatelor SERVQUAL pentru Spitalul Calitas. */
(function () {
  'use strict';
  var C = window.CALITAS, K = window.CAL, CFG = window.CALITAS_CONFIG || {}, CH = window.CALITAS_CHEIE || null;
  var esc = K.esc, fmt = K.fmt, fmtS = K.fmtS, mean = K.mean;
  var ALL = [], filt = { grupa: '', profil: '', dim: '' };
  var dash = document.getElementById('dash');
  var statusEl = document.getElementById('status');
  var EP_KEY = 'calitas_teacher_ep';

  function $(id) { return document.getElementById(id); }
  function setStatus(m, bad) { statusEl.textContent = m; statusEl.style.color = bad ? 'var(--alert)' : 'var(--ink)'; }
  function pct(x) { return Math.round(x * 100) + '%'; }
  function profLabel(id) { var p = K.profileById(id); return p ? p.eticheta : id; }
  function short(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function toMin(r) { return r.dur && r.dur.total ? Math.round(r.dur.total / 60) : null; }

  /* ---------- Încărcare date ---------- */
  function addRecords(arr, replace) {
    var map = {}, bad = 0;
    if (!replace) ALL.forEach(function (r) { map[r.id] = r; });
    (arr || []).forEach(function (r) {
      if (!K.validRec(r)) { bad++; return; }
      if (!r.id) r.id = K.studentId(r.student);
      if (!map[r.id] || String(r.ts || '') >= String(map[r.id].ts || '')) map[r.id] = r;
    });
    ALL = Object.keys(map).map(function (k) { return map[k]; });
    return bad;
  }
  function loadSheet() {
    var ep = $('endpoint').value.trim() || CFG.endpoint, key = $('tkey').value.trim();
    if (!ep) { setStatus('Introdu adresa colectorului Apps Script (sau setează-o în config.js).', true); return; }
    if (!key) { setStatus('Introdu cheia profesorului.', true); return; }
    K.store.set(EP_KEY, ep);
    setStatus('Se încarcă…');
    fetch(ep + (ep.indexOf('?') < 0 ? '?' : '&') + 'action=list&key=' + encodeURIComponent(key))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || 'răspuns invalid');
        var bad = addRecords(j.rows, true);
        setStatus(ALL.length + ' răspunsuri încărcate' + (bad ? ' (' + bad + ' ignorate: format invalid)' : '') + '.');
        render();
      })
      .catch(function (e) { setStatus('Nu s-au putut încărca datele: ' + e.message, true); });
  }
  function loadFiles(files) {
    var list = Array.prototype.slice.call(files || []), pending = list.length, bad = 0;
    if (!pending) return;
    list.forEach(function (f) {
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var j = JSON.parse(fr.result);
          bad += addRecords(Array.isArray(j) ? j : (j.rows || [j]), false);
        } catch (e) { bad++; }
        if (--pending === 0) { setStatus(ALL.length + ' răspunsuri în total' + (bad ? ' (' + bad + ' fișiere sau înregistrări ignorate)' : '') + '.'); render(); }
      };
      fr.onerror = function () { bad++; if (--pending === 0) render(); };
      fr.readAsText(f);
    });
  }

  /* ---------- Agregare ---------- */
  function usedProfiles() {
    var u = {}; ALL.forEach(function (r) { u[r.profil] = 1; });
    return C.profiles.filter(function (p) { return u[p.id]; });
  }
  function single() { var u = usedProfiles(); return u.length === 1 ? u[0] : null; }
  function filtered() {
    return ALL.filter(function (r) {
      return (!filt.grupa || r.student.grupa === filt.grupa) && (!filt.profil || r.profil === filt.profil);
    });
  }
  function bottom3(itemGap) {
    return itemGap.map(function (g, i) { return { g: g, n: i + 1 }; })
      .sort(function (a, b) { return a.g - b.g || a.n - b.n; }).slice(0, 3).map(function (o) { return o.n; });
  }
  function aggregate(recs) {
    var g = { n: recs.length };
    if (!g.n) return g;
    var an = g.an = recs.map(K.analyze);
    g.A = {}; g.P = {}; g.gap = {}; g.imp = {}; g.share = {};
    K.ids.forEach(function (k) {
      g.A[k] = mean(an.map(function (a) { return a.A[k]; }));
      g.P[k] = mean(an.map(function (a) { return a.P[k]; }));
      g.gap[k] = g.P[k] - g.A[k];
      g.imp[k] = mean(recs.map(function (r) { return r.imp && r.imp[k] != null ? r.imp[k] : 20; }));
      g.share[k] = an.filter(function (a) { return a.gap[k] <= -1; }).length / g.n;
    });
    g.ipcs = mean(an.map(function (a) { return a.ipcs; }));
    g.ipcsW = mean(an.map(function (a) { return a.ipcsW; }));
    g.sat = mean(an.map(function (a) { return a.sat; }));
    g.ipcsList = an.map(function (a) { return a.ipcs; });
    g.item = [];
    for (var i = 0; i < 22; i++) {
      var gaps = an.map(function (a) { return a.itemGap[i]; });
      g.item.push({
        n: i + 1,
        A: mean(recs.map(function (r) { return r.exp[i]; })),
        P: mean(recs.map(function (r) { return r.per[i]; })),
        gap: mean(gaps), sd: K.sd(gaps),
        sdP: K.sd(recs.map(function (r) { return r.per[i]; })),
        minP: Math.min.apply(null, recs.map(function (r) { return r.per[i]; })),
        maxP: Math.max.apply(null, recs.map(function (r) { return r.per[i]; })),
        share: gaps.filter(function (x) { return x <= -1; }).length / g.n
      });
    }
    var gl = recs.filter(function (r) { return r.global && r.global.nps >= 0; });
    g.npsN = gl.length;
    g.nps = gl.length ? (gl.filter(function (r) { return r.global.nps >= 9; }).length - gl.filter(function (r) { return r.global.nps <= 6; }).length) / gl.length * 100 : NaN;
    g.satG = gl.length ? mean(gl.map(function (r) { return r.global.sat; })) : NaN;
    var durs = recs.map(toMin).filter(function (x) { return x != null; });
    g.dur = durs.length ? mean(durs) : NaN;
    g.flagged = recs.filter(function (r) { return K.flags(r).length; }).length;
    if (CH && CH.tinte) {
      var hit = an.filter(function (a) {
        return bottom3(a.itemGap).filter(function (n) { return CH.tinte.indexOf(n) >= 0; }).length >= 2;
      }).length;
      g.detect = hit / g.n;
    }
    return g;
  }

  function byProfile(recs) {
    var o = {};
    C.profiles.forEach(function (p) { o[p.id] = aggregate(recs.filter(function (r) { return r.profil === p.id; })); });
    return o;
  }

  /* ---------- Constatări automate ---------- */
  function findings(g, recs, bp) {
    var F = [], dims = C.dimensions.slice().sort(function (a, b) { return g.gap[a.id] - g.gap[b.id]; });
    var w = dims[0], s = dims[dims.length - 1];
    F.push({ k: 'hot', t: '<b>Cea mai mare discrepanță: ' + esc(w.nume) + ' (' + fmtS(g.gap[w.id]) + ').</b> Percepția medie este ' + fmt(g.P[w.id]) + ', față de o așteptare de ' + fmt(g.A[w.id]) + '. ' + pct(g.share[w.id]) + ' dintre studenți au o diferență de −1 sau mai mică.' });
    F.push({ k: 'good', t: '<b>Cel mai aproape de așteptări: ' + esc(s.nume) + ' (' + fmtS(g.gap[s.id]) + ').</b> Percepția medie este ' + fmt(g.P[s.id]) + ', față de ' + fmt(g.A[s.id]) + '.' });
    if (g.gap.S - g.gap.R >= 0.8) {
      F.push({ k: '', t: '<b>Competența clinică nu compensează organizarea.</b> Siguranța (' + fmtS(g.gap.S) + ') stă mult mai bine decât Capacitatea de răspuns (' + fmtS(g.gap.R) + '). Spitalul este perceput ca fiind competent, dar lent și insuficient de informat: problema ține de procese și de comunicare, nu de pregătirea profesională.' });
    }
    var topImp = C.dimensions.slice().sort(function (a, b) { return g.imp[b.id] - g.imp[a.id]; })[0];
    F.push({ k: g.gap[topImp.id] < -0.5 ? 'hot' : '', t: '<b>Cea mai importantă dimensiune pentru pacienți: ' + esc(topImp.nume) + ' (' + fmt(g.imp[topImp.id], 0) + ' din 100 de puncte).</b> ' +
      (g.gap[topImp.id] < -0.5 ? 'Aici discrepanța este de ' + fmtS(g.gap[topImp.id]) + ', deci combinația dintre importanță mare și performanță slabă o face prioritate maximă.' : 'Discrepanța ei este de ' + fmtS(g.gap[topImp.id]) + ', deci spitalul își ține bine promisiunea acolo unde contează cel mai mult.') });
    var ps = C.profiles.filter(function (p) { return bp[p.id].n >= 3; });
    if (ps.length >= 2) {
      var best = null;
      C.dimensions.forEach(function (d) {
        var vals = ps.map(function (p) { return { p: p, v: bp[p.id].gap[d.id] }; }).sort(function (a, b) { return a.v - b.v; });
        var spread = vals[vals.length - 1].v - vals[0].v;
        if (!best || spread > best.spread) best = { d: d, spread: spread, lo: vals[0], hi: vals[vals.length - 1] };
      });
      F.push({ k: '', t: '<b>Profilurile de pacient diferă cel mai mult la ' + esc(best.d.nume) + '.</b> De la ' + fmtS(best.lo.v) + ' (' + esc(best.lo.p.eticheta) + ') la ' + fmtS(best.hi.v) + ' (' + esc(best.hi.p.eticheta) + '). Folosiți diferența ca punct de plecare pentru discuția despre fluxuri diferite de pacienți.' });
    }
    if (single() && g.n >= 5) {
      var sp = g.item.slice().sort(function (a, b) { return b.sdP - a.sdP; })[0];
      F.push({ k: '', t: '<b>Aceeași experiență, evaluări diferite.</b> Toți studenții au trăit același parcurs, dar la enunțul ' + sp.n + ' («' + esc(C.items[sp.n - 1].s) + '») percepțiile merg de la ' + sp.minP + ' la ' + sp.maxP + ' (σ = ' + fmt(sp.sdP) + '). Diferența nu vine din serviciu, ci din cum l-a interpretat fiecare: exact ideea calității percepute.' });
    }
    if (g.detect != null) {
      F.push({ k: g.detect < 0.5 ? 'hot' : '', t: '<b>Rata de detecție a neconformității: ' + pct(g.detect) + '.</b> Atâția studenți au printre cele mai mari trei deficite cel puțin două dintre enunțurile asupra cărora a fost construit scenariul (așteptare lungă și neinformată). ' + (g.detect < 0.5 ? 'Sub 50%: puneți-i pe studenți să explice ce au observat și ce au ignorat.' : 'Majoritatea au văzut problema centrală; discuția poate merge direct spre cauze.') });
    }
    if (!isNaN(g.nps)) {
      F.push({ k: g.nps < 0 ? 'hot' : '', t: '<b>Indicele de recomandare (NPS): ' + fmtS(g.nps, 0) + '.</b> Mulțumirea globală medie este ' + fmt(g.satG, 1) + ' din 5. Comparați-o cu IPCS: un pacient poate fi mulțumit global chiar dacă dimensiunile arată discrepanțe, sau invers.' });
    }
    if (g.flagged) {
      F.push({ k: '', t: '<b>Calitatea răspunsurilor:</b> ' + g.flagged + ' din ' + g.n + ' răspunsuri au semnale de atenție (răspunsuri aproape uniforme sau sub 20 de minute). Verificați-le în secțiunea Studenți.' });
    }
    return F;
  }

  /* ---------- Secțiuni ---------- */
  function secToolbar() {
    var grupe = {}; ALL.forEach(function (r) { grupe[r.student.grupa] = 1; });
    var gl = Object.keys(grupe).sort();
    return '<div class="toolbar noprint"><label class="f">Grupă<select class="flt" data-f="grupa"><option value="">Toate grupele</option>' +
      gl.map(function (x) { return '<option' + (filt.grupa === x ? ' selected' : '') + ' value="' + esc(x) + '">' + esc(x) + '</option>'; }).join('') + '</select></label>' +
      (single() ? '</div>' : '<label class="f">Profil de pacient<select class="flt" data-f="profil"><option value="">Toate profilurile</option>' +
      C.profiles.map(function (p) { return '<option' + (filt.profil === p.id ? ' selected' : '') + ' value="' + p.id + '">' + esc(p.eticheta) + '</option>'; }).join('') + '</select></label></div>');
  }
  var TABS = [['sinteza', 'Sinteză'], ['enunturi', 'Enunțuri'], ['prioritati', 'Prioritizare'], ['profiluri', 'Profiluri și parcurs'], ['nevoi', 'Nevoi și acțiuni'], ['studenti', 'Studenți'], ['cheie', 'Cheia scenariului'], ['dezbatere', 'Dezbatere'], ['export', 'Export']];
  var tab = 'sinteza';
  function nav() {
    return '<nav class="tnav noprint" role="tablist" aria-label="Secțiunile raportului">' + TABS.map(function (x) {
      return '<button role="tab" data-tab="' + x[0] + '" aria-selected="' + (tab === x[0]) + '">' + (x[0] === 'profiluri' && single() ? 'Parcursul pacientului' : x[1]) + '</button>';
    }).join('') + '<span class="sp"></span><button class="pres" data-present="1">' + (document.body.classList.contains('present') ? 'Ieși din prezentare' : 'Mod prezentare') + '</button></nav>';
  }
  function showTab() {
    dash.querySelectorAll('section.tsec').forEach(function (s) { s.hidden = s.id !== tab; });
    dash.querySelectorAll('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === tab)); });
  }

  function secSinteza(g, recs, bp) {
    var kpi = function (cls, v, l) { return '<div class="kpi ' + cls + '"><b>' + v + '</b><span>' + l + '</span></div>'; };
    var k = '<div class="kpis">' +
      kpi('', g.n, 'răspunsuri analizate') +
      kpi(g.ipcs < 0 ? 'neg' : 'pos', fmtS(g.ipcs), 'IPCS mediu (media P − A pe dimensiuni)') +
      kpi(g.ipcsW < 0 ? 'neg' : 'pos', fmtS(g.ipcsW), 'IPCS ponderat cu importanța') +
      kpi('', fmt(g.sat, 0) + '%', 'grad de satisfacție (P / A)') +
      kpi(g.nps < 0 ? 'neg' : '', isNaN(g.nps) ? '–' : fmtS(g.nps, 0), 'NPS (recomandare)') +
      kpi('', isNaN(g.dur) ? '–' : Math.round(g.dur) + ' min', 'timp mediu de completare') + '</div>';
    var rows = C.dimensions.map(function (d) {
      var b = K.band(g.gap[d.id]);
      return '<tr><td><b>' + esc(d.nume) + '</b></td><td class="num">' + fmt(g.A[d.id]) + '</td><td class="num">' + fmt(g.P[d.id]) + '</td><td class="num" style="' + K.heat(g.gap[d.id]) + '"><b>' + fmtS(g.gap[d.id]) + '</b></td><td class="num">' + fmt(g.imp[d.id], 0) + '</td><td class="num">' + fmtS(g.gap[d.id] * g.imp[d.id] / 100) + '</td><td class="num">' + pct(g.share[d.id]) + '</td><td><span class="tag ' + b.k + '">' + esc(b.t) + '</span></td></tr>';
    }).join('');
    var hist = K.histogram(g.ipcsList, [-5, -2, -1.5, -1, -0.5, 0, 5], ['sub −2', '−2…−1,5', '−1,5…−1', '−1…−0,5', '−0,5…0', 'peste 0']);
    return '<section class="tsec" id="sinteza"><h2>Sinteză</h2>' + k +
      '<div class="grid2"><div class="card">' + K.radar([{ name: 'Așteptări (A)', cls: 'a', v: g.A }, { name: 'Percepții (P)', cls: 'p', v: g.P }]) + '</div>' +
      '<div class="card"><h3>Distribuția IPCS pe studenți</h3>' + hist + '<p class="small muted">Fiecare coloană arată câți studenți au IPCS în intervalul respectiv.</p></div></div>' +
      '<div class="card"><h3>Pe dimensiuni</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Dimensiune</th><th class="num">A</th><th class="num">P</th><th class="num">P − A</th><th class="num">Importanță</th><th class="num">Contribuție ponderată</th><th class="num">Studenți cu P − A ≤ −1</th><th>Interpretare</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      '<h3>Ce se vede în date</h3>' + findings(g, recs, bp).map(function (f) { return '<div class="finding ' + f.k + '">' + f.t + '</div>'; }).join('') + '</section>';
  }

  function secEnunturi(g) {
    var tinte = CH && CH.tinte ? CH.tinte : [];
    var sorted = g.item.slice().sort(function (a, b) { return a.gap - b.gap; });
    var bars = K.divBars(sorted.map(function (it) {
      return { label: it.n + '. ' + short(C.items[it.n - 1].s, 34), v: it.gap, hl: tinte.indexOf(it.n) >= 0 };
    }), { max: 3, labelW: 250, aria: 'Diferența dintre percepție și așteptare, pe cele 22 de enunțuri, ordonate de la cea mai mare discrepanță' });
    var rows = g.item.map(function (it) {
      var d = C.items[it.n - 1];
      return '<tr><td class="num">' + it.n + '</td><td>' + esc(K.itemText(d, 'P')) + '</td><td>' + esc(K.dimById[d.d].nume) + '</td><td class="num">' + fmt(it.A) + '</td><td class="num">' + fmt(it.P) + '</td><td class="num" style="' + K.heat(it.gap) + '"><b>' + fmtS(it.gap) + '</b></td><td class="num">' + pct(it.share) + '</td><td class="num">' + fmt(it.sd) + '</td></tr>';
    }).join('');
    return '<section class="tsec" id="enunturi"><h2>Cele 22 de enunțuri</h2>' +
      '<div class="card"><p class="small muted">Barele sunt ordonate de la cea mai mare discrepanță. ' + (tinte.length ? 'Conturul gros marchează enunțurile asupra cărora a fost construit scenariul.' : '') + '</p>' + bars + '</div>' +
      '<div class="card"><h3>Tabel complet</h3><p class="small muted">Abaterea standard (σ) a diferențelor arată cât de împărțiți sunt studenții: o valoare mare înseamnă ' + (single() ? 'interpretări diferite ale aceleiași experiențe' : 'experiențe diferite între profiluri') + '.</p><div class="tblwrap"><table class="tbl"><thead><tr><th class="num">Nr.</th><th>Enunț (Spitalul Calitas)</th><th>Dimensiune</th><th class="num">A</th><th class="num">P</th><th class="num">P − A</th><th class="num">Cu P − A ≤ −1</th><th class="num">σ</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></section>';
  }

  function secPrioritati(g) {
    var pts = C.dimensions.map(function (d) { return { label: d.scurt, x: g.gap[d.id], y: g.imp[d.id] }; });
    var maxY = Math.max(45, Math.ceil((Math.max.apply(null, pts.map(function (p) { return p.y; })) + 6) / 5) * 5);
    var svg = K.matrix(pts, { xmin: -3.5, xmax: 1.5, ymin: 0, ymax: maxY, xThresh: -0.5, yThresh: 20 });
    var cls = function (d) {
      var hi = g.imp[d.id] >= 20, bad = g.gap[d.id] < -0.5;
      return hi && bad ? ['hot', 'Prioritate maximă'] : hi ? ['good', 'De menținut'] : bad ? ['', 'Prioritate secundară'] : ['', 'Efort posibil excesiv'];
    };
    var list = C.dimensions.slice().sort(function (a, b) { return g.gap[a.id] * g.imp[a.id] - g.gap[b.id] * g.imp[b.id]; }).map(function (d) {
      var c = cls(d);
      return '<div class="finding ' + c[0] + '"><b>' + esc(d.nume) + ': ' + c[1] + '.</b> Importanță ' + fmt(g.imp[d.id], 0) + ' puncte, discrepanță ' + fmtS(g.gap[d.id]) + '. <span class="muted small">' + esc(d.iso) + '</span></div>';
    }).join('');
    return '<section class="tsec" id="prioritati"><h2>Prioritizare</h2><div class="grid2"><div class="card">' + svg +
      '<p class="small muted">Linia verticală este la −0,5 (prag de discrepanță semnificativă), iar cea orizontală la 20 de puncte (importanță egală pentru toate cele 5 dimensiuni).</p></div><div>' + list + '</div></div></section>';
  }

  function secProfiluri(recs, bp) {
    var head = C.dimensions.map(function (d) { return '<th class="num">' + esc(d.scurt) + '</th>'; }).join('');
    var rows = C.profiles.map(function (p) {
      var a = bp[p.id];
      if (!a.n) return '<tr><td>' + esc(p.eticheta) + '</td><td class="num">0</td><td colspan="7" class="muted">fără răspunsuri</td></tr>';
      return '<tr><td><b>' + esc(p.eticheta) + '</b><br><span class="small muted">' + esc(p.persona.nume) + '</span></td><td class="num">' + a.n + '</td>' +
        C.dimensions.map(function (d) { return '<td class="num" style="' + K.heat(a.gap[d.id]) + '">' + fmtS(a.gap[d.id]) + '</td>'; }).join('') +
        '<td class="num"><b>' + fmtS(a.ipcs) + '</b></td></tr>';
    }).join('');
    var mom = C.profiles.map(function (p) {
      var rs = recs.filter(function (r) { return r.profil === p.id; });
      if (!rs.length) return '';
      var trs = p.momente.map(function (m) {
        var vals = [], notes = [];
        rs.forEach(function (r) {
          var x = r.momente && r.momente[m.id];
          if (x && x.r) vals.push(x.r);
          if (x && x.n && String(x.n).trim()) notes.push({ n: r.student.prenume, t: x.n });
        });
        var mv = vals.length ? mean(vals) : NaN, low = vals.length ? vals.filter(function (v) { return v <= 2; }).length / vals.length : NaN;
        return '<tr><td>' + esc(m.ora) + '</td><td>' + esc(m.titlu) + (notes.length ? '<details class="small"><summary>' + notes.length + ' observații</summary>' + notes.slice(0, 8).map(function (x) { return '<p style="margin:.3em 0"><b>' + esc(x.n) + ':</b> ' + esc(x.t) + '</p>'; }).join('') + '</details>' : '') + '</td>' +
          '<td class="num">' + (m.asteptare ? m.asteptare + ' min' : '–') + '</td><td class="num" style="' + K.heat5(mv) + '"><b>' + fmt(mv, 1) + '</b></td><td class="num">' + (isNaN(low) ? '–' : pct(low)) + '</td></tr>';
      }).join('');
      return '<div class="card"><h3>' + esc(p.eticheta) + ' · ' + esc(p.persona.nume) + ' (' + rs.length + ' studenți)</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Ora</th><th>Momentul adevărului</th><th class="num">Așteptare reală</th><th class="num">Cum s-au simțit (1–5)</th><th class="num">Scor 1–2</th></tr></thead><tbody>' + trs + '</tbody></table></div></div>';
    }).join('');
    var one = single();
    if (one) {
      return '<section class="tsec" id="profiluri"><h2>Parcursul lui ' + esc(one.persona.nume) + '</h2><p class="muted">' + esc(one.eticheta) + '. Momentele adevărului: unde s-a rupt experiența, comparat cu timpul real de așteptare.</p>' +
        mom.replace(/<h3>.*?<\/h3>/, '<h3>Notele studenților pe fiecare moment (' + recs.length + ' studenți)</h3>') + '</section>';
    }
    return '<section class="tsec" id="profiluri"><h2>Profiluri și parcurs</h2>' +
      '<div class="card"><h3>Diferența P − A pe profil și dimensiune</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Profil</th><th class="num">N</th>' + head + '<th class="num">IPCS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      '<h3>Momentele adevărului</h3><p class="muted">Aici se vede unde s-a rupt experiența: comparați scorurile cu timpul real de așteptare.</p>' + mom + '</section>';
  }

  function secNevoi(g) {
    var worst = g.item.slice().sort(function (a, b) { return a.gap - b.gap; }).filter(function (x) { return x.gap < -0.5; }).slice(0, 8);
    var rows = worst.length ? worst.map(function (it) {
      var d = C.items[it.n - 1], dim = K.dimById[d.d];
      return '<div class="action"><div class="gv neg">' + fmtS(it.gap, 1) + '</div><div><b>' + it.n + '. ' + esc(d.s) + '</b> <span class="badge">' + esc(dim.nume) + '</span><br>' + esc(d.a) + '<br><span class="small muted">' + esc(dim.iso) + '</span></div></div>';
    }).join('') : '<p>Nicio discrepanță medie sub −0,5 la nivel de enunț. Verificați filtrele sau datele.</p>';
    return '<section class="tsec" id="nevoi"><h2>Nevoi și acțiuni</h2><div class="card"><h3>Cele mai mari deficite și măsuri sugerate</h3>' +
      '<p class="muted">Lista este generată din datele grupului și din biblioteca de măsuri a aplicației. Folosiți-o ca punct de plecare pentru discuția din clasă, nu ca soluție finală.</p>' + rows + '</div></section>';
  }


  function momentsOf(r) {
    var p = K.profileById(r.profil); if (!p) return '';
    var gl = r.global || {};
    return '<table class="tbl"><thead><tr><th>Moment</th><th class="num">Notă</th></tr></thead><tbody>' + p.momente.map(function (m) {
      var x = (r.momente || {})[m.id] || {};
      return '<tr><td>' + esc(m.titlu) + (x.n && String(x.n).trim() ? '<br><span class="small muted">' + esc(x.n) + '</span>' : '') + '</td><td class="num"><span class="rchip" style="' + K.heat5(x.r) + '">' + (x.r || '–') + '</span></td></tr>';
    }).join('') + '</tbody></table><p class="small" style="margin-top:10px">Mulțumire globală: <b>' + (gl.sat || '–') + '</b> din 5. Recomandare: <b>' + (gl.nps >= 0 ? gl.nps : '–') + '</b> din 10.' + (gl.cuvant ? ' Cuvântul ales: <b>' + esc(gl.cuvant) + '</b>.' : '') + '</p>';
  }

  function secStudenti(recs) {
    var sorted = recs.slice().sort(function (a, b) { return (a.student.nume + a.student.prenume).localeCompare(b.student.nume + b.student.prenume, 'ro'); });
    var items = sorted.map(function (r) {
      var a = K.analyze(r), fl = K.flags(r), m = toMin(r);
      var dims = C.dimensions.map(function (d) { return '<tr><td>' + esc(d.nume) + '</td><td class="num">' + fmt(a.A[d.id]) + '</td><td class="num">' + fmt(a.P[d.id]) + '</td><td class="num" style="' + K.heat(a.gap[d.id]) + '">' + fmtS(a.gap[d.id]) + '</td><td class="num">' + (r.imp ? r.imp[d.id] : '–') + '</td></tr>'; }).join('');
      return '<details class="rowd"><summary><span><b>' + esc(r.student.nume + ' ' + r.student.prenume) + '</b></span><span>' + esc(r.student.grupa) + '</span><span class="small">' + (single() ? 'recomandare ' + (r.global && r.global.nps >= 0 ? r.global.nps : '–') + ' din 10' : esc(short(profLabel(r.profil), 34))) + '</span><span class="num">' + fmtS(a.ipcs) + '</span><span class="num">' + (m != null ? m + ' min' : '–') + '</span><span>' + (fl.length ? '<span class="badge r" title="' + esc(fl.join(', ')) + '">atenție</span>' : '') + '</span></summary><div class="inner">' +
        '<div class="grid2"><div><table class="tbl"><thead><tr><th>Dimensiune</th><th class="num">A</th><th class="num">P</th><th class="num">P − A</th><th class="num">Imp.</th></tr></thead><tbody>' + dims + '</tbody></table>' +
        (fl.length ? '<p class="small" style="color:var(--alert)">Semnale: ' + esc(fl.join(', ')) + '</p>' : '') + '</div><div>' +
        momentsOf(r) + '</div></div></div></details>';
    }).join('');
    return '<section class="tsec" id="studenti"><h2>Studenți</h2><p class="muted">Deschide un rând pentru răspunsurile individuale, notele pe momente și observațiile scrise.</p>' +
      '<div class="rowhead"><span>Student</span><span>Grupă</span><span>' + (single() ? 'Recomandare' : 'Profil') + '</span><span>IPCS</span><span>Durată</span><span></span></div>' + items + '</section>';
  }

  function secCheie(recs, g) {
    if (!CH) {
      return '<section class="tsec" id="cheie"><h2>Cheia scenariului</h2><div class="infobox">Fișierul <code>cheie.js</code> nu este încărcat. Acolo se află lista neconformităților introduse intenționat în fiecare scenariu. Poți să nu-l publici pe GitHub, ca studenții să nu-l poată citi din codul sursă.</div></section>';
    }
    var shown = usedProfiles().length ? usedProfiles() : C.profiles;
    var cards = shown.map(function (p) {
      var n = recs.filter(function (r) { return r.profil === p.id; }).length;
      return '<div class="cheie"><h3>' + esc(p.eticheta) + ' · ' + esc(p.persona.nume) + ' <span class="muted small">(' + n + ' studenți)</span></h3><ul>' +
        (CH.profile[p.id] || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
    return '<section class="tsec" id="cheie"><h2>Cheia scenariului</h2>' +
      '<div class="infobox">Neconformitatea centrală introdusă în ' + (single() ? 'scenariu' : 'toate cele patru scenarii') + ': <b>așteptare lungă și neinformată</b>, cu promisiuni din «Cartea promisiunilor» încălcate. ' + (single() ? 'Scenariul conține' : 'Scenariile conțin') + ' și puncte forte reale (competență, amabilitate, echipamente moderne), ca studenții să diferențieze problemele. Așteptați: cele mai mari deficite la <b>Capacitate de răspuns</b> și <b>Fiabilitate</b>, <b>Siguranța</b> și <b>Tangibilitatea</b> mai aproape de așteptări, iar <b>Empatia</b> mixtă.</div>' +
      (g.detect != null ? '<div class="finding ' + (g.detect < 0.5 ? 'hot' : 'good') + '"><b>Rata de detecție: ' + pct(g.detect) + '.</b> Enunțurile țintă sunt ' + CH.tinte.join(', ') + '.</div>' : '') + cards + '</section>';
  }

  function secDezbatere() {
    var q = CH && CH.dezbatere ? CH.dezbatere : [];
    if (!q.length) return '<section class="tsec" id="dezbatere"><h2>Ghid de dezbatere</h2><div class="infobox">Ghidul de dezbatere se află în <code>cheie.js</code>, care nu este încărcat.</div></section>';
    return '<section class="tsec" id="dezbatere"><h2>Ghid de dezbatere</h2><p class="muted">Propunere pentru o discuție de 30–40 de minute, după ce ați prezentat rezultatele.</p><ol class="debate">' +
      q.map(function (x) { return '<li><b>' + esc(x.q) + '</b><span class="muted">' + esc(x.n) + '</span></li>'; }).join('') + '</ol></section>';
  }

  function secExport() {
    return '<section class="tsec noprint" id="export"><h2>Export</h2><div class="card"><div class="nav" style="justify-content:flex-start">' +
      '<button class="btn" data-exp="csv">Descarcă tabelul (CSV pentru Excel)</button><button class="btn" data-exp="json">Descarcă datele (JSON)</button><button class="btn" data-exp="print">Tipărește / salvează PDF</button></div>' +
      '<p class="small muted" style="margin-top:12px">CSV-ul folosește ; ca separator și virgula zecimală, deschizându-se direct în Excel în versiunea în limba română. Exportul respectă filtrele aplicate.</p></div></section>';
  }

  /* ---------- Randare ---------- */
  function render() {
    if (!ALL.length) {
      dash.innerHTML = '<div class="card empty"><h2>Nu există încă date</h2><p>Încarcă răspunsurile din Google Sheets, din fișierele descărcate de studenți sau folosește datele demonstrative pentru a vedea cum arată tabloul de bord.</p></div>';
      return;
    }
    var recs = filtered();
    if (!recs.length) { dash.innerHTML = secToolbar() + '<div class="card empty"><p>Niciun răspuns pentru filtrul ales.</p></div>'; return; }
    var g = aggregate(recs), bp = byProfile(recs);
    dash.innerHTML = nav() + '<div style="height:18px"></div>' + secToolbar() + secSinteza(g, recs, bp) + secEnunturi(g) + secPrioritati(g) + secProfiluri(recs, bp) + secNevoi(g) + secStudenti(recs) + secCheie(recs, g) + secDezbatere() + secExport();
    showTab();
    connectState();
  }
  function connectState() {
    var box = $('connect');
    box.classList.toggle('loaded', ALL.length > 0);
    $('loadedmsg').textContent = ALL.length + ' răspunsuri încărcate.';
  }

  /* ---------- Evenimente ---------- */
  dash.addEventListener('change', function (e) {
    var t = e.target;
    if (t.classList.contains('flt')) {
      var y = window.scrollY; filt[t.dataset.f] = t.value; render(); window.scrollTo(0, y);
    }
  });
  dash.addEventListener('click', function (e) {
    var tb = e.target.closest('[data-tab]');
    if (tb) { tab = tb.dataset.tab; showTab(); window.scrollTo(0, 0); return; }
    var pr = e.target.closest('[data-present]');
    if (pr) { document.body.classList.toggle('present'); pr.textContent = document.body.classList.contains('present') ? 'Ieși din prezentare' : 'Mod prezentare'; return; }
    var b = e.target.closest('[data-exp]');
    if (!b) return;
    var recs = filtered();
    if (b.dataset.exp === 'csv') K.download('calitas_rezultate.csv', K.toCSV(recs), 'text/csv');
    else if (b.dataset.exp === 'json') K.download('calitas_rezultate.json', JSON.stringify(recs, null, 1), 'application/json');
    else window.print();
  });
  $('btn-load').addEventListener('click', loadSheet);
  $('btn-change').addEventListener('click', function () { $('connect').classList.remove('loaded'); });
  $('files').addEventListener('change', function (e) { loadFiles(e.target.files); });
  var drop = $('drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { loadFiles(e.dataTransfer.files); });
  $('btn-demo').addEventListener('click', function () {
    if (!window.CALITAS_DEMO) { setStatus('Fișierul demo.js lipsește.', true); return; }
    addRecords(window.CALITAS_DEMO(48), true);
    setStatus('Date demonstrative: ' + ALL.length + ' studenți fictivi.');
    render();
  });
  $('endpoint').value = K.store.get(EP_KEY) || CFG.endpoint || '';
  if (!window.CALITAS_DEMO) { /* butonul rămâne, dar va raporta lipsa fișierului */ }
  render();
})();
