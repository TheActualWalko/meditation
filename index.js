const {resolve} = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const db = {};

fs.readFileSync('db.log', 'utf8')
  .split('\n')
  .forEach((line) => {
    const [userID, track, time, timestamp] = line.split('/');
    if (userID) db[userID] = {track, time};
  }, {});

const doc = fs.readFileSync('index.html', 'utf8');

app.get('/m/:id', ({params: {id}}, res) => {
  const {track, time} = db[id];
  res.send(
    doc
      .replace(/\$TRACK/g, track)
      .replace(/\$START_FROM/g, time)
      .replace(/\$USER/g, id)
  );
});

app.get('/u/:id/time/:time', ({params: {id, time}}, res) => {
  db[id].time = time;
  fs.appendFile(
    'db.log', 
    `\n${id}/${db[id].track}/${time}/${Date.now()}`, 
    ()=>res.send('')
  );
});

app.get('/audio/:file', (req, res) => {
  res.sendFile(resolve(__dirname, `audio/${req.params.file}`));
});

app.get('/', (req, res) => res.send('asdf'));
app.listen(3000, () => console.log('Listening on 3000'));