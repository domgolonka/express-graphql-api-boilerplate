import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  // eslint-disable-next-line
  console.log('Example app listening on port 3000!');
});
