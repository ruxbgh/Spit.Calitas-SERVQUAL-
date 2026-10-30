/* Date demonstrative (fictive) pentru a vedea cum arată zona profesorului. Nu sunt date reale. */
window.CALITAS_DEMO = function (n) {
  'use strict';
  var C = window.CALITAS, K = window.CAL;
  var seed = 20261030;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function norm() { return (rnd() + rnd() + rnd() + rnd() - 2) * 1.7; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }

  var nume = ['Popescu', 'Ionescu', 'Radu', 'Stan', 'Dumitru', 'Georgescu', 'Constantin', 'Matei', 'Preda', 'Ene', 'Barbu', 'Nistor', 'Tudor', 'Lazăr', 'Munteanu', 'Voicu'];
  var prenume = ['Andreea', 'Mihai', 'Elena', 'Cristian', 'Ioana', 'Alexandru', 'Maria', 'Bogdan', 'Ana', 'Vlad', 'Diana', 'Răzvan', 'Simona', 'Ștefan', 'Laura', 'Teodor'];
  var cauze = [
    'Fluxul pacienților nu este separat între cazurile urgente și cele de rutină, iar personalul este insuficient în intervalele de vârf, ceea ce produce cozi și întârzieri.',
    'Nu există un sistem de informare activă a pacienților despre cât au de așteptat; ecranele de apel nu funcționează, iar personalul nu are timp să explice.',
    'Programările sunt făcute fără a ține cont de durata reală a consulturilor, deci se suprapun, iar urgențele dezorganizează tot programul zilei.',
    'Capacitatea de internare nu corespunde cererii: paturile se eliberează târziu, iar blocul operator este folosit și pentru urgențe fără rezervă de timp.',
    'Conducerea a investit în aparatură, dar nu și în procese și în comunicare; calitatea tehnică este bună, însă experiența pacientului este neglijată.'
  ];
  var sig = [
    'Un pacient lăsat ore întregi fără reevaluare își poate agrava starea fără să fie observat; aș introduce reevaluarea periodică la fiecare 30 de minute.',
    'Lipsa confidențialității pe hol și pe targă expune datele și demnitatea pacientului; aș amenaja paravane și zone de triaj separate.',
    'Pacientul nemâncat sau deshidratat prea mult timp riscă complicații; aș comunica din timp ora estimată și aș oferi perfuzie unde e cazul.',
    'Erorile de documente pot duce la tratamente greșite; aș introduce o verificare dublă a identității și a scrisorii medicale.'
  ];
  var tari = [
    'Competența și amabilitatea medicilor și a asistentelor, precum și aparatura nouă, trebuie păstrate și date ca exemplu.',
    'Explicațiile clare ale medicului și verificarea repetată a identității pacientului sunt practici bune.',
    'Educația individuală oferită de asistentă și echipamentele moderne sunt puncte forte reale ale spitalului.',
    'Echipa din blocul operator și modul în care sunt explicate riscurile creează încredere.'
  ];
  var mesaje = [
    'Investiți acum în informarea pacienților: costă puțin și schimbă complet experiența așteptării.',
    'Aparatura este bună, dar pacientul nu vede aparatura, ci timpul pierdut. Reproiectați fluxurile.',
    'Fiți sinceri cu pacienții despre durata așteptării; promisiunile nerespectate costă încrederea.',
    'Oamenii dumneavoastră sunt valoarea spitalului. Dați-le timp și resurse să explice.'
  ];
  var props = [
    ['Afișarea pe ecrane a ordinii de apel și a timpului estimat de așteptare, actualizat automat.', 'Capacitate de răspuns', 'Departamentul IT', 'Termen scurt (1–3 luni)', 'Mediu', 'Timpul median de așteptare afișat față de cel real'],
    ['Introducerea unui «ghid al pacientului» la intrarea în UPU, care explică codurile și informează la 30 de minute.', 'Capacitate de răspuns', 'Șef de secție / compartiment', 'Imediat (sub 30 de zile)', 'Redus', 'Procentul pacienților informați despre durata așteptării'],
    ['Reproiectarea programărilor din ambulatoriu, cu intervale de 15 minute și rezervă pentru urgențe.', 'Fiabilitate', 'Managerul calității', 'Termen scurt (1–3 luni)', 'Mediu', 'Procentul consulturilor începute în maximum 30 de minute de la oră'],
    ['Verificarea dublă a datelor pacientului la înregistrare și înainte de eliberarea scrisorii medicale.', 'Fiabilitate', 'Compartimentul de relații cu publicul', 'Imediat (sub 30 de zile)', 'Redus', 'Numărul de erori de documentare pe lună'],
    ['Reparația priză, aer condiționat și toalete în zonele de așteptare, cu verificare săptămânală.', 'Tangibilitate', 'Conducerea spitalului', 'Termen scurt (1–3 luni)', 'Mediu', 'Procentul din lista de verificare cu zero deficiențe'],
    ['Program de instruire în comunicare cu pacientul, pe baza cazurilor din această analiză.', 'Empatie', 'Managerul calității', 'Termen mediu (3–12 luni)', 'Mediu', 'Scorul la chestionarul anual la dimensiunea Empatie'],
    ['Planificarea blocului operator cu rezervă de 20% pentru urgențe și comunicarea orei reale pacienților.', 'Fiabilitate', 'Conducerea spitalului', 'Termen mediu (3–12 luni)', 'Ridicat', 'Întârzierea medie a intervențiilor programate'],
    ['Actualizarea materialelor informative și a semnalisticii, testate cu pacienții.', 'Tangibilitate', 'Compartimentul de relații cu publicul', 'Termen scurt (1–3 luni)', 'Redus', 'Procentul pacienților care găsesc singuri destinația'],
    ['Zone de așteptare cu scaune și apă pentru vârstnici, plus program de farmacie prelungit.', 'Empatie', 'Conducerea spitalului', 'Termen mediu (3–12 luni)', 'Mediu', 'Satisfacția vârstnicilor la chestionarul scurt']
  ];

  var baseA = { T: 4.3, F: 4.6, R: 4.5, S: 4.7, E: 4.4 };
  var baseP = { T: 3.7, F: 2.9, R: 2.4, S: 4.2, E: 3.4 };
  var tweak = { urgenta: { R: -0.3, E: -0.2 }, ambulatoriu: { F: -0.2, T: -0.3 }, internare: { F: -0.3, E: -0.2 }, cronic: { R: -0.1, E: 0.3, S: 0.1 } };
  var basImp = { T: 12, F: 24, R: 26, S: 20, E: 18 };

  var out = [];
  for (var i = 0; i < n; i++) {
    var fix = window.CALITAS_CONFIG && K.profileById(window.CALITAS_CONFIG.profilFix);
    var p = fix || C.profiles[i % C.profiles.length], st = {
      nume: nume[Math.floor(i / 3) % nume.length], prenume: prenume[(i * 5 + 2) % prenume.length], grupa: i % 2 ? 'MBA 1, grupa 1' : 'MBA 1, grupa 2'
    };
    if (out.some(function (r) { return r.student.nume === st.nume && r.student.prenume === st.prenume && r.student.grupa === st.grupa; })) st.nume += '-' + (i + 1);
    var exp = [], per = [], uniform = (i === 7 || i === 31);
    C.items.forEach(function (it) {
      var a = Math.round(clamp(baseA[it.d] + norm() * 0.45, 1, 5));
      var tw = (tweak[p.id] || {})[it.d] || 0;
      var bump = [5, 8, 10, 11, 13].indexOf(it.n) >= 0 ? -0.6 : [1, 14, 17].indexOf(it.n) >= 0 ? 0.5 : 0;
      var pv = Math.round(clamp(baseP[it.d] + tw + bump + norm() * 0.55, 1, 5));
      exp.push(uniform ? 5 : a); per.push(uniform ? 3 : pv);
    });
    var w = {}, tot = 0;
    K.ids.forEach(function (k) { w[k] = Math.max(1, basImp[k] + norm() * 5); tot += w[k]; });
    var imp = {}, s = 0, big = 'R';
    K.ids.forEach(function (k) { imp[k] = Math.round(w[k] / tot * 100 / 5) * 5; s += imp[k]; if (w[k] > w[big]) big = k; });
    imp[big] += 100 - s;
    var mom = {};
    p.momente.forEach(function (m) {
      var base = m.asteptare > 100 ? 1.6 : m.asteptare > 40 ? 2.4 : m.serviciu > 0 && !m.asteptare ? 4.3 : 3.4;
      mom[m.id] = { r: Math.round(clamp(base + norm() * 0.5, 1, 5)), n: rnd() < 0.18 ? pick(['Nimeni nu ne-a spus cât mai durează.', 'Personalul a fost amabil, dar copleșit.', 'Mă așteptam să fiu informat.', 'Aici m-am simțit ignorat.']) : '' };
    });
    var dim = pick(['R', 'F', 'R']);
    var pr = []; var a1 = pick(props), a2 = pick(props);
    [a1, a2].forEach(function (x) { pr.push({ actiune: x[0], dim: x[1], responsabil: x[2], termen: x[3], efort: x[4], indicator: x[5] }); });
    var tmin = i === 12 || i === 40 ? 14 + Math.floor(rnd() * 4) : 40 + Math.floor(rnd() * 16);
    var rec = {
      v: 1, id: 'demo' + (i + 1), ts: new Date(2026, 10, 3, 10, 0, i).toISOString(),
      student: st, profil: p.id, cod: '', exp: exp, per: per, imp: imp, momente: mom,
      global: { sat: Math.round(clamp(2.5 + norm() * 0.6, 1, 5)), nps: Math.round(clamp(5.2 + norm() * 1.8, 0, 10)), cuvant: pick(['așteptare', 'aglomerat', 'competență', 'neinformat', 'obosit']) },
      dur: { total: tmin * 60 }
    };
    out.push(rec);
  }
  return out;
};
