const prisma = require('../db');

async function getPackages(req, res) {
  const packages = await prisma.package.findMany({ orderBy: { id: 'asc' } });
  res.json(packages);
}

async function createPackage(req, res) {
  const { name, version } = req.body;

  if (!name || !version) {
    return res.status(400).json({ error: 'Name and version are required.' });
  }

  try {
    const newPackage = await prisma.package.create({
      data: {
        name,
        version,
      },
    });

    console.log('Package created:', JSON.stringify(newPackage, null, 2));
    return res.status(201).json(newPackage);
  } catch (error) {
    console.error('Failed to create package', error);
    return res.status(500).json({ error: 'Failed to create package.' });
  }
}

module.exports = {
  getPackages,
  createPackage,
};
