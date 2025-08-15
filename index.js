
const express = require('express');
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 8030;

app.use(express.json());
app.use(cors());

app.use(express.static("public"));

const db = new sqlite3.Database('./pomodoro.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the pomodoro database.');
});
/* 
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pomodoros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT,
    inicio TEXT,
    final TEXT,
    tipo TEXT,
    task TEXT
  )`);
}); */

app.post('/pomodoros', (req, res) => {
  const { fecha, inicio, final, tipo, task } = req.body;
  console.log({stamp: (new Date()).toLocaleString(), fecha, inicio, final, tipo, task });
  
  db.run(`INSERT INTO pomodoros (fecha, inicio, final, tipo, task) VALUES (?, ?, ?, ?, ?)`, [fecha, inicio, final, tipo, task], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.get('/pomodoros', (req, res) => {
  db.all(`SELECT id, fecha, inicio, final, tipo, task FROM pomodoros ORDER BY inicio`, [], (err, rows) => {
    if (err) {
      return console.log(err.message);
    }
    res.status(200).json({ pomodoros: rows });
  });
});

app.delete('/pomodoros/:id', (req, res) => {
  const { id } = req.params;
  console.log(`${(new Date()).toLocaleString()} deleting pomodoro id ${id}`);
  db.run(`DELETE FROM pomodoros WHERE id = ?`, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Pomodoro not found' });
    }
    res.status(200).json({ message: 'Pomodoro deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
