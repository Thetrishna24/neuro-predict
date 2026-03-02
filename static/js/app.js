// ── State ─────────────────────────────────────────────────────────────────────
var cur         = 'alzheimers';
var lastScore   = null;
var lastFactors = null;
var lastRisk    = null;
var patients    = [];

// ── Page nav ──────────────────────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-'+name).classList.add('active');
  event.currentTarget.classList.add('active');
  if (name === 'patients') loadPatients();
  if (name === 'history')  { loadStats(); loadHistory(); }
}

// ── Disease tabs ──────────────────────────────────────────────────────────────
function setDisease(d, btn) {
  cur = d;
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  renderForm();
  resetResults();
}

function resetResults() {
  lastScore = null; lastFactors = null; lastRisk = null;
  document.getElementById('btnSave').disabled = true;
  document.getElementById('resultsPanel').innerHTML =
    '<div class="placeholder"><div class="icon">&#129504;</div>' +
    '<p>Complete the patient profile and click <strong>Analyze Risk</strong> to generate an assessment, ' +
    'then <strong>Save to DB</strong> to store it.</p></div>';
}

// ── Form rendering ────────────────────────────────────────────────────────────
function renderForm() {
  var d = D[cur];
  function rows(arr) {
    return arr.map(function(s) {
      return '<div class="check-item" onclick="tog(\''+s.id+'\',this)">' +
             '<input type="checkbox" id="'+s.id+'" data-w="'+s.weight+'">' +
             '<label>'+s.label+'</label></div>';
    }).join('');
  }
  document.getElementById('symptomGrid').innerHTML = rows(d.symptoms);
  document.getElementById('motorGrid').innerHTML   = rows(d.motor);
  document.getElementById('geneticGrid').innerHTML = rows(d.genetic);
  document.getElementById('biomarkerRow').innerHTML = d.biomarkers.map(function(b) {
    return '<div class="biomarker-field"><label>'+b.label+'</label>' +
           '<input type="number" id="'+b.id+'" placeholder="'+b.placeholder+'" title="'+b.ref+'"></div>';
  }).join('');
}

function tog(id, el) {
  var cb = document.getElementById(id);
  cb.checked = !cb.checked;
  el.classList.toggle('checked', cb.checked);
}

// ── Scoring ───────────────────────────────────────────────────────────────────
function analyze() {
  var d   = D[cur];
  var age = parseInt(document.getElementById('age').value);
  var sex = document.getElementById('sex').value;
  var edu = document.getElementById('education').value;
  var score = 0;
  var all = d.symptoms.concat(d.motor).concat(d.genetic);

  all.forEach(function(s) {
    var el = document.getElementById(s.id);
    if (el && el.checked) score += s.weight;
  });

  if      (age >= 85) score += .20;
  else if (age >= 75) score += .12;
  else if (age >= 65) score += .07;
  else if (age >= 55) score += .03;

  if      (edu === 'graduate')  score -= .04;
  else if (edu === 'bachelors') score -= .02;
  else if (edu === 'less_hs')   score += .03;

  if (cur === 'alzheimers' && sex === 'female') score += .04;
  if (cur === 'msa'        && sex === 'male')   score += .03;

  var raw = Math.min(Math.round(score * 100), 98);
  var dc  = d.factors.length;
  var fs  = d.factors.map(function(_, i) {
    var b = Math.random() * .3;
    var c = all.filter(function(s, idx) {
      return document.getElementById(s.id) &&
             document.getElementById(s.id).checked &&
             Math.floor(idx / (all.length / dc)) === i;
    }).length;
    return Math.min(Math.round((b + c * .25 + (raw / 100) * .4) * 100), 100);
  });

  lastScore   = raw;
  lastFactors = fs;
  if      (raw < 25) lastRisk = 'Low Risk';
  else if (raw < 50) lastRisk = 'Moderate Risk';
  else if (raw < 75) lastRisk = 'Elevated Risk';
  else               lastRisk = 'High Risk';

  var lb = document.getElementById('loadingBar');
  lb.style.display = 'block';
  setTimeout(function() {
    lb.style.display = 'none';
    showResults(raw, fs, d);
    document.getElementById('btnSave').disabled = false;
  }, 700);
}

function showResults(score, factors, d) {
  var lvl, col, desc;
  if      (score < 25) { lvl='Low Risk';      col='#10b981'; desc='Few high-weight risk factors. Continued monitoring and lifestyle optimization recommended.'; }
  else if (score < 50) { lvl='Moderate Risk'; col='#f59e0b'; desc='Several moderate-weight indicators present. Structured follow-up and targeted workup warranted.'; }
  else if (score < 75) { lvl='Elevated Risk'; col='#ef4444'; desc='Multiple high-weight factors identified. Expedited specialist referral and comprehensive evaluation indicated.'; }
  else                 { lvl='High Risk';     col='#dc2626'; desc='Significant risk burden across multiple domains. Urgent specialist evaluation required.'; }

  document.getElementById('resultsPanel').innerHTML =
    '<div class="gauge-card" style="animation:fadeUp .5s ease both">' +
    '<div class="section-title">Risk Score</div>' +
    '<div class="gauge-wrap"><canvas id="gauge" width="360" height="200"></canvas>' +
    '<div class="gauge-score">'+score+'<sup>%</sup></div></div>' +
    '<div class="risk-label" style="color:'+col+'">'+lvl+'</div>' +
    '<div class="risk-desc">'+desc+'</div></div>' +

    '<div class="factors-card" style="animation:fadeUp .5s .1s ease both">' +
    '<div class="section-title">Contributing Factors</div>' +
    d.factors.map(function(f,i) {
      var g = i%2 ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#00d4ff,#0088aa)';
      return '<div class="factor-row"><div class="factor-name">'+f+'</div>' +
             '<div class="factor-bar-bg"><div class="factor-bar" id="b'+i+'" style="background:'+g+'"></div></div>' +
             '<div class="factor-val">'+factors[i]+'%</div></div>';
    }).join('') + '</div>' +

    '<div class="rec-card" style="animation:fadeUp .5s .2s ease both">' +
    '<div class="section-title">Clinical Recommendations</div>' +
    d.recs.map(function(r) {
      return '<div class="rec-item"><div class="rec-icon" style="background:'+r.color+'">'+r.icon+'</div>' +
             '<div class="rec-text"><strong>'+r.title+'</strong>'+r.text+'</div></div>';
    }).join('') + '</div>';

  setTimeout(function() {
    drawGauge(score, col);
    d.factors.forEach(function(_, i) {
      setTimeout(function() {
        var b = document.getElementById('b'+i);
        if (b) b.style.width = factors[i]+'%';
      }, i * 80);
    });
  }, 50);
}

function drawGauge(score, color) {
  var cv = document.getElementById('gauge'); if (!cv) return;
  var ctx = cv.getContext('2d'), w=cv.width, h=cv.height, cx=w/2, cy=h*.85, r=Math.min(w,h*2)*.42;
  ctx.clearRect(0,0,w,h);
  ctx.beginPath(); ctx.arc(cx,cy,r,Math.PI,0); ctx.strokeStyle='#1e3a5f'; ctx.lineWidth=14; ctx.lineCap='round'; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,r,Math.PI,Math.PI+(score/100)*Math.PI); ctx.strokeStyle=color; ctx.lineWidth=14; ctx.stroke();
  for(var i=0;i<=100;i+=25){var a=Math.PI+(i/100)*Math.PI;ctx.beginPath();ctx.moveTo(cx+(r-10)*Math.cos(a),cy+(r-10)*Math.sin(a));ctx.lineTo(cx+(r+4)*Math.cos(a),cy+(r+4)*Math.sin(a));ctx.strokeStyle='#334155';ctx.lineWidth=2;ctx.stroke();}
}

// ── Save to DB ────────────────────────────────────────────────────────────────
function saveAssessment() {
  var pid = document.getElementById('patientSelect').value;
  if (!pid) { showToast('Please select a patient first', true); return; }
  if (lastScore === null) { showToast('Run analysis first', true); return; }

  var d   = D[cur];
  var all = d.symptoms.concat(d.motor).concat(d.genetic);
  var checkedSymptoms = all.filter(function(s) {
    var el = document.getElementById(s.id);
    return el && el.checked;
  }).map(function(s){ return s.id; });

  fetch('/api/assessments', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      patient_id:    parseInt(pid),
      disease:       cur,
      age:           parseInt(document.getElementById('age').value),
      sex:           document.getElementById('sex').value,
      education:     document.getElementById('education').value,
      symptoms:      checkedSymptoms,
      score:         lastScore,
      risk_level:    lastRisk,
      factor_scores: lastFactors,
      notes:         document.getElementById('clinicalNotes').value
    })
  })
  .then(function(r){ return r.json(); })
  .then(function() {
    showToast('Assessment saved successfully!');
    document.getElementById('btnSave').disabled = true;
    loadHeaderStats();
  })
  .catch(function(){ showToast('Save failed', true); });
}

// ── Patients ──────────────────────────────────────────────────────────────────
function loadPatients() {
  fetch('/api/patients')
    .then(function(r){ return r.json(); })
    .then(function(data) {
      patients = data;
      // Update assess page selector
      var sel = document.getElementById('patientSelect');
      var cur_val = sel.value;
      sel.innerHTML = '<option value="">— Select or create patient —</option>';
      data.forEach(function(p) {
        sel.innerHTML += '<option value="'+p.id+'"'+(p.id==cur_val?' selected':'')+'>'+p.name+'</option>';
      });
      // Update history selector
      var hsel = document.getElementById('historyPatient');
      hsel.innerHTML = '<option value="">All Patients</option>';
      data.forEach(function(p){
        hsel.innerHTML += '<option value="'+p.id+'">'+p.name+'</option>';
      });
      // Render cards
      var grid = document.getElementById('patientsList');
      if (!data.length) {
        grid.innerHTML = '<div class="empty-msg">No patients yet. Click <strong>+ New Patient</strong> to add one.</div>';
        return;
      }
      grid.innerHTML = data.map(function(p) {
        var dob = p.dob ? ' · DOB: '+p.dob : '';
        var date = p.created.split('T')[0];
        return '<div class="patient-card">' +
          '<div class="patient-card-name">'+p.name+'</div>' +
          '<div class="patient-card-meta">Added: '+date+dob+'</div>' +
          '<span class="count-badge">'+p.assessment_count+' assessment'+(p.assessment_count!==1?'s':'')+'</span>' +
          (p.notes ? '<div style="font-size:.72rem;color:var(--muted);margin-top:.5rem">'+p.notes+'</div>' : '') +
          '<div class="patient-card-actions">' +
          '<button class="btn-secondary" style="font-size:.72rem;padding:.4rem .8rem" onclick="selectAndAssess('+p.id+',\''+p.name+'\')">Assess</button>' +
          '<button class="btn-danger" onclick="deletePatient('+p.id+',event)">Delete</button>' +
          '</div></div>';
      }).join('');
    });
}

function selectAndAssess(pid, name) {
  document.getElementById('patientSelect').value = pid;
  showPage('assess');
  // manually activate assess nav
  document.querySelectorAll('.nav-btn').forEach(function(b,i){ b.classList.toggle('active', i===0); });
  document.getElementById('page-patients').classList.remove('active');
  document.getElementById('page-assess').classList.add('active');
}

function onPatientChange() {
  // nothing extra needed, pid is read on save
}

function openNewPatient() {
  document.getElementById('newPatientName').value = '';
  document.getElementById('newPatientDob').value  = '';
  document.getElementById('newPatientNotes').value= '';
  document.getElementById('modalOverlay').classList.add('open');
  setTimeout(function(){ document.getElementById('newPatientName').focus(); }, 100);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function createPatient() {
  var name = document.getElementById('newPatientName').value.trim();
  if (!name) { document.getElementById('newPatientName').focus(); return; }
  fetch('/api/patients', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      name:  name,
      dob:   document.getElementById('newPatientDob').value,
      notes: document.getElementById('newPatientNotes').value
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(p) {
    closeModal();
    showToast('Patient "'+p.name+'" created!');
    loadPatients();
    loadHeaderStats();
    // Auto-select new patient
    setTimeout(function(){
      document.getElementById('patientSelect').value = p.id;
    }, 300);
  });
}

function deletePatient(pid, e) {
  e.stopPropagation();
  if (!confirm('Delete this patient and all their assessments?')) return;
  fetch('/api/patients/'+pid, {method:'DELETE'})
    .then(function(){ loadPatients(); loadHeaderStats(); showToast('Patient deleted'); });
}

// ── History ───────────────────────────────────────────────────────────────────
function loadHistory() {
  var pid = document.getElementById('historyPatient').value;
  var dis = document.getElementById('historyDisease').value;
  var url = pid ? '/api/patients/'+pid+'/assessments' : '/api/patients/all-assessments';

  // For all patients we fetch each patient's assessments
  if (!pid) {
    fetch('/api/patients')
      .then(function(r){ return r.json(); })
      .then(function(pts) {
        if (!pts.length) {
          document.getElementById('historyList').innerHTML = '<div class="empty-msg">No assessments yet.</div>';
          return;
        }
        var promises = pts.map(function(p){
          return fetch('/api/patients/'+p.id+'/assessments')
            .then(function(r){ return r.json(); })
            .then(function(ass){ return ass.map(function(a){ a._patient_name=p.name; return a; }); });
        });
        Promise.all(promises).then(function(all) {
          var flat = [].concat.apply([], all);
          flat.sort(function(a,b){ return b.created.localeCompare(a.created); });
          if (dis) flat = flat.filter(function(a){ return a.disease===dis; });
          renderHistory(flat);
        });
      });
  } else {
    fetch('/api/patients/'+pid+'/assessments')
      .then(function(r){ return r.json(); })
      .then(function(data) {
        var pname = '';
        patients.forEach(function(p){ if(p.id==pid) pname=p.name; });
        data.forEach(function(a){ a._patient_name=pname; });
        if (dis) data = data.filter(function(a){ return a.disease===dis; });
        renderHistory(data);
      });
  }
}

function renderHistory(items) {
  var el = document.getElementById('historyList');
  if (!items.length) {
    el.innerHTML = '<div class="empty-msg">No assessments found.</div>';
    return;
  }
  var diseaseLabels = {alzheimers:"Alzheimer's",parkinsons:"Parkinson's",als:'ALS',huntingtons:"Huntington's",msa:'MSA / PSP'};
  el.innerHTML = items.map(function(a) {
    var riskClass = a.risk_level.toLowerCase().replace(' ','-');
    var date = a.created.split('T')[0];
    var time = a.created.split('T')[1] ? a.created.split('T')[1].substring(0,5) : '';
    return '<div class="history-item">' +
      '<div class="hi-score" style="color:'+riskColor(a.score)+'">'+a.score+'<span style="font-size:.8rem;opacity:.5">%</span></div>' +
      '<div class="hi-info">' +
      '<div class="hi-name">'+a._patient_name+'</div>' +
      '<div class="hi-meta">Age '+a.age+' · '+cap(a.sex)+' · '+cap(a.education)+' · '+date+' '+time+'</div>' +
      '<span class="hi-disease">'+(diseaseLabels[a.disease]||a.disease)+'</span>' +
      '<span class="hi-risk '+riskClass.replace(' ','-')+'">'+a.risk_level+'</span>' +
      (a.notes ? '<div style="font-size:.72rem;color:var(--muted);margin-top:.4rem">'+a.notes+'</div>' : '') +
      '</div>' +
      '<button class="btn-danger" onclick="deleteAssessment('+a.id+')">&#128465;</button>' +
      '</div>';
  }).join('');
}

function riskColor(score) {
  if (score < 25) return '#10b981';
  if (score < 50) return '#f59e0b';
  if (score < 75) return '#ef4444';
  return '#dc2626';
}

function cap(s) {
  if (!s) return '';
  return s.replace(/_/g,' ').replace(/\b\w/g,function(c){ return c.toUpperCase(); });
}

function deleteAssessment(aid) {
  if (!confirm('Delete this assessment?')) return;
  fetch('/api/assessments/'+aid, {method:'DELETE'})
    .then(function(){ loadHistory(); loadStats(); loadHeaderStats(); showToast('Assessment deleted'); });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function loadStats() {
  fetch('/api/stats')
    .then(function(r){ return r.json(); })
    .then(function(s) {
      document.getElementById('statsRow').innerHTML =
        '<div class="stat-box"><div class="num">'+s.total_patients+'</div><div class="lbl">Patients</div></div>' +
        '<div class="stat-box"><div class="num">'+s.total_assessments+'</div><div class="lbl">Assessments</div></div>' +
        '<div class="stat-box"><div class="num" style="color:#ef4444">'+s.high_risk+'</div><div class="lbl">Elevated+</div></div>';
    });
}

function loadHeaderStats() {
  fetch('/api/stats')
    .then(function(r){ return r.json(); })
    .then(function(s) {
      document.getElementById('headerStats').textContent =
        s.total_patients+' patients · '+s.total_assessments+' assessments';
    });
}

// ── Toast notification ────────────────────────────────────────────────────────
function showToast(msg, isError) {
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = isError ? '#ef4444' : '#10b981';
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderForm();
loadPatients();
loadHeaderStats();
