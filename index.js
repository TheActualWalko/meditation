const {resolve} = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const db = {};

fs.writeFileSync('db.log', '123/track-one/60/0\n456/track-two/21/0', 'utf8');

fs.readFileSync('db.log', 'utf8')
  .split('\n')
  .forEach((line) => {
    const [userID, track, time, timestamp] = line.split('/');
    if (userID) db[userID] = {track, time};
  }, {});


app.get('/m/:id', ({params: {id}}, res) => {
  const {track, time} = db[id];
  res.send(
    fs.readFileSync('index.html', 'utf8')
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

app.get('/styles/style.css', (req, res) => {
  res.sendFile(resolve(__dirname, `styles/style.css`));
});

app.get('/styles/vg-sound-player.css', (req, res) => {
  res.sendFile(resolve(__dirname, `styles/vg-sound-player.css`));
});

app.get('/scripts/jquery.js', (req, res) => {
  res.sendFile(resolve(__dirname, `scripts/jquery.js`));
});

app.get('/scripts/vg-sound-player.js', (req, res) => {
  res.sendFile(resolve(__dirname, `scripts/vg-sound-player.js`));
});

app.get('/', (req, res) => res.send('asdf'));
app.listen(3000, () => console.log('Listening on 3000'));