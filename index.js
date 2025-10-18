const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Hello from my local API!');
});

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Armindo' }, { id: 2, name: 'Mazivila' }]);
});

app.post('/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ message: 'User created', user });
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));