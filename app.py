from flask import Flask, request, jsonify, render_template
import json, os
from datetime import datetime

app = Flask(__name__)

DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    import psycopg2

    def get_db():
        conn = psycopg2.connect(DATABASE_URL)
        return conn

    def init_db():
        conn = get_db()
        cur = conn.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS patients (
            id      SERIAL PRIMARY KEY,
            name    TEXT NOT NULL,
            dob     TEXT,
            notes   TEXT,
            created TEXT NOT NULL
        )''')
        cur.execute('''CREATE TABLE IF NOT EXISTS assessments (
            id            SERIAL PRIMARY KEY,
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
            created       TEXT NOT NULL
        )''')
        conn.commit()
        cur.close()
        conn.close()

    def fetchall(cur):
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]

    def fetchone_id(cur):
        return cur.fetchone()[0]

    PH = '%s'

else:
    import sqlite3

    DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'neuro.db')

    def get_db():
        conn = sqlite3.connect(DB)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db():
        conn = get_db()
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
            created       TEXT NOT NULL
        )''')
        conn.commit()
        conn.close()

    def fetchall(cur):
        return [dict(r) for r in cur.fetchall()]

    def fetchone_id(cur):
        return cur.lastrowid

    PH = '?'

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/patients', methods=['GET'])
def get_patients():
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        'SELECT p.*, COUNT(a.id) as assessment_count '
        'FROM patients p LEFT JOIN assessments a ON p.id=a.patient_id '
        'GROUP BY p.id ORDER BY p.created DESC'
    )
    rows = fetchall(cur)
    cur.close()
    conn.close()
    return jsonify(rows)

@app.route('/api/patients', methods=['POST'])
def create_patient():
    d = request.json
    now = datetime.now().isoformat()
    conn = get_db()
    cur = conn.cursor()
    if DATABASE_URL:
        cur.execute(
            f'INSERT INTO patients (name,dob,notes,created) VALUES ({PH},{PH},{PH},{PH}) RETURNING id',
            (d['name'], d.get('dob',''), d.get('notes',''), now)
        )
        pid = cur.fetchone()[0]
    else:
        cur.execute(
            f'INSERT INTO patients (name,dob,notes,created) VALUES ({PH},{PH},{PH},{PH})',
            (d['name'], d.get('dob',''), d.get('notes',''), now)
        )
        pid = cur.lastrowid
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': pid, 'name': d['name'], 'created': now}), 201

@app.route('/api/patients/<int:pid>', methods=['DELETE'])
def delete_patient(pid):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(f'DELETE FROM assessments WHERE patient_id={PH}', (pid,))
    cur.execute(f'DELETE FROM patients WHERE id={PH}', (pid,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'deleted': pid})

@app.route('/api/assessments', methods=['POST'])
def save_assessment():
    d = request.json
    now = datetime.now().isoformat()
    conn = get_db()
    cur = conn.cursor()
    if DATABASE_URL:
        cur.execute(
            f'''INSERT INTO assessments
               (patient_id,disease,age,sex,education,symptoms,score,risk_level,factor_scores,notes,created)
               VALUES ({PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH}) RETURNING id''',
            (d['patient_id'], d['disease'], d['age'], d['sex'], d['education'],
             json.dumps(d.get('symptoms',[])), d['score'], d['risk_level'],
             json.dumps(d.get('factor_scores',[])), d.get('notes',''), now)
        )
        aid = cur.fetchone()[0]
    else:
        cur.execute(
            f'''INSERT INTO assessments
               (patient_id,disease,age,sex,education,symptoms,score,risk_level,factor_scores,notes,created)
               VALUES ({PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH})''',
            (d['patient_id'], d['disease'], d['age'], d['sex'], d['education'],
             json.dumps(d.get('symptoms',[])), d['score'], d['risk_level'],
             json.dumps(d.get('factor_scores',[])), d.get('notes',''), now)
        )
        aid = cur.lastrowid
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': aid, 'created': now}), 201

@app.route('/api/patients/<int:pid>/assessments', methods=['GET'])
def get_patient_assessments(pid):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(f'SELECT * FROM assessments WHERE patient_id={PH} ORDER BY created DESC', (pid,))
    rows = fetchall(cur)
    cur.close()
    conn.close()
    for row in rows:
        row['symptoms']      = json.loads(row['symptoms'] or '[]')
        row['factor_scores'] = json.loads(row['factor_scores'] or '[]')
    return jsonify(rows)

@app.route('/api/assessments/<int:aid>', methods=['DELETE'])
def delete_assessment(aid):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(f'DELETE FROM assessments WHERE id={PH}', (aid,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'deleted': aid})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) FROM patients')
    tp = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM assessments')
    ta = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM assessments WHERE risk_level IN ('High Risk','Elevated Risk')")
    hr = cur.fetchone()[0]
    cur.execute('SELECT disease, COUNT(*) cnt, AVG(score) avg_score FROM assessments GROUP BY disease')
    bd = fetchall(cur)
    cur.close()
    conn.close()
    return jsonify({'total_patients':tp,'total_assessments':ta,'high_risk':hr,'by_disease':bd})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f'\n  NeuroPredict running → http://localhost:{port}\n')
    app.run(debug=False, host='0.0.0.0', port=port)
    