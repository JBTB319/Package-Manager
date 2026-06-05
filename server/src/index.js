const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Package Manager API is running.' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
