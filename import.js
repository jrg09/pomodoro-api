
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');

const db = new sqlite3.Database('./pomodoro.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the pomodoro database.');
});

const fileStream = fs.createReadStream('pomodoro.json');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(line);
  const pomodoro = JSON.parse(line);
  const { fecha, inicio, final, tipo, task } = pomodoro;
  db.run(`INSERT INTO pomodoros (fecha, inicio, final, tipo, task) VALUES (?, ?, ?, ?, ?)`, [fecha, inicio, final, tipo, task], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
});

rl.on('close', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});
