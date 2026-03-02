"""
NeuroPredict — Flask Backend
Run with:  python app.py
Open:      http://localhost:5000
"""

from flask import Flask, request, jsonify, render_template
import sqlite3, json, os
from datetime import datetime

app = Flask(__name__)
DB = 'neuro.db'

# ── Database ──────────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS patients (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT NOT NULL,
            dob     TEXT,
            notes   TEXT,
            created TEXT NOT NULL
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS assessments (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id    INTEGER NOT NULL,
            disease       TEXT NOT NULL,
            age           INTEGER,
            sex           TEXT,
            education     TEXT,
            symptoms      TEXT,
            score         INTEGER,
            risk_level    TEXT,
            factor_scores TEXT,
            notes         TEXT,
            created       TEXT NOT NULL,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )''')
        conn.commit()

# ── Pages ─────────────────────────────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')

# ── Patients API ──────────────────────────────────────────────────────────────
@app.route('/api/patients', methods=['GET'])
def get_patients():
    with get_db() as conn:
        rows = conn.execute(
            'SELECT p.*, COUNT(a.id) as assessment_count '
            'FROM patients p LEFT JOIN assessments a ON p.id=a.patient_id '
            'GROUP BY p.id ORDER BY p.created DESC'
        ).fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/api/patients', methods=['POST'])
def create_patient():
    d   = request.json
    now = datetime.now().isoformat()
    with get_db() as conn:
        cur = conn.execute(
            'INSERT INTO patients (name,dob,notes,created) VALUES (?,?,?,?)',
            (d['name'], d.get('dob',''), d.get('notes',''), now)
        )
        conn.commit()
    return jsonify({'id': cur.lastrowid, 'name': d['name'], 'created': now}), 201

@app.route('/api/patients/<int:pid>', methods=['DELETE'])
def delete_patient(pid):
    with get_db() as conn:
        conn.execute('DELETE FROM assessments WHERE patient_id=?', (pid,))
        conn.execute('DELETE FROM patients WHERE id=?', (pid,))
        conn.commit()
    return jsonify({'deleted': pid})

# ── Assessments API ───────────────────────────────────────────────────────────
@app.route('/api/assessments', methods=['POST'])
def save_assessment():
    d   = request.json
    now = datetime.now().isoformat()
    with get_db() as conn:
        cur = conn.execute(
            '''INSERT INTO assessments
               (patient_id,disease,age,sex,education,symptoms,
                score,risk_level,factor_scores,notes,created)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)''',
            (d['patient_id'], d['disease'], d['age'], d['sex'], d['education'],
             json.dumps(d.get('symptoms',[])), d['score'], d['risk_level'],
             json.dumps(d.get('factor_scores',[])), d.get('notes',''), now)
        )
        conn.commit()
    return jsonify({'id': cur.lastrowid, 'created': now}), 201

@app.route('/api/patients/<int:pid>/assessments', methods=['GET'])
def get_patient_assessments(pid):
    with get_db() as conn:
        rows = conn.execute(
            'SELECT * FROM assessments WHERE patient_id=? ORDER BY created DESC', (pid,)
        ).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        d['symptoms']      = json.loads(d['symptoms'] or '[]')
        d['factor_scores'] = json.loads(d['factor_scores'] or '[]')
        out.append(d)
    return jsonify(out)

@app.route('/api/assessments/<int:aid>', methods=['DELETE'])
def delete_assessment(aid):
    with get_db() as conn:
        conn.execute('DELETE FROM assessments WHERE id=?', (aid,))
        conn.commit()
    return jsonify({'deleted': aid})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    with get_db() as conn:
        tp  = conn.execute('SELECT COUNT(*) FROM patients').fetchone()[0]
        ta  = conn.execute('SELECT COUNT(*) FROM assessments').fetchone()[0]
        hr  = conn.execute("SELECT COUNT(*) FROM assessments WHERE risk_level IN ('High Risk','Elevated Risk')").fetchone()[0]
        bd  = conn.execute('SELECT disease,COUNT(*) cnt,AVG(score) avg_score FROM assessments GROUP BY disease').fetchall()
    return jsonify({'total_patients':tp,'total_assessments':ta,'high_risk':hr,'by_disease':[dict(r) for r in bd]})

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 8080))
    print(f'\n  NeuroPredict running → http://localhost:{port}\n')
    app.run(debug=False, host='0.0.0.0', port=port)
