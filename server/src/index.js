const express = require('express');
const cors = require('cors');
const prisma = require('./db');
const packageRoutes = require('./routes/packages');
const recipientRoutes = require('./routes/recipients');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Package Manager API is running.' });
});

app.use('/packages', packageRoutes);
app.use('/recipients', recipientRoutes);

async function start() {
  // Ensure the placeholder user (id=1) exists so loggedInById works before auth lands
  const existing = await prisma.user.findFirst();
  if (!existing) {
    await prisma.user.create({
      data: { name: 'Bibek Bhattarai', email: 'bibek@gatech.edu' },
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
