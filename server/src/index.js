const express = require('express');
const cors = require('cors');
const packageRoutes = require('./routes/packages');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Package Manager API is running.' });
});

app.use('/packages', packageRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
