const prisma = require('../db');

const INCLUDE = {
  recipient: true,
  loggedInBy: { select: { id: true, name: true } },
};

// Placeholder until auth lands — will be the authenticated user's id
const CURRENT_USER_ID = 1;

async function getPackages(req, res) {
  const packages = await prisma.package.findMany({
    orderBy: { id: 'asc' },
    include: INCLUDE,
  });
  res.json(packages);
}

async function createPackage(req, res) {
  const { recipientId, site, courier, trackingNum, dimensions, location, notes } = req.body;

  if (!recipientId || !site || !courier || !location) {
    return res.status(400).json({ error: 'recipientId, site, courier, and location are required.' });
  }

  try {
    const pkg = await prisma.package.create({
      data: {
        recipient:   { connect: { id: Number(recipientId) } },
        loggedInBy:  { connect: { id: CURRENT_USER_ID } },
        site,
        courier,
        location,
        trackingNum: trackingNum || null,
        dimensions:  dimensions  || null,
        notes:       notes       || null,
      },
      include: INCLUDE,
    });
    return res.status(201).json(pkg);
  } catch (err) {
    console.error('Failed to create package', err);
    if (err.code === 'P2025') return res.status(400).json({ error: 'Recipient not found.' });
    return res.status(500).json({ error: 'Failed to create package.' });
  }
}

async function updatePackage(req, res) {
  const id = Number(req.params.id);
  const { recipientId, site, courier, trackingNum, dimensions, location, notes } = req.body;

  try {
    const pkg = await prisma.package.update({
      where: { id },
      data: {
        ...(recipientId !== undefined && { recipient: { connect: { id: Number(recipientId) } } }),
        ...(site        !== undefined && { site }),
        ...(courier     !== undefined && { courier }),
        ...(location    !== undefined && { location }),
        ...(trackingNum !== undefined && { trackingNum: trackingNum || null }),
        ...(dimensions  !== undefined && { dimensions:  dimensions  || null }),
        ...(notes       !== undefined && { notes:       notes       || null }),
      },
      include: INCLUDE,
    });
    return res.json(pkg);
  } catch (err) {
    console.error('Failed to update package', err);
    if (err.code === 'P2025') return res.status(404).json({ error: 'Package not found.' });
    return res.status(500).json({ error: 'Failed to update package.' });
  }
}

async function deletePackage(req, res) {
  const id = Number(req.params.id);
  try {
    await prisma.package.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Package not found.' });
    return res.status(500).json({ error: 'Failed to delete package.' });
  }
}

async function checkoutPackage(req, res) {
  const id = Number(req.params.id);
  try {
    const pkg = await prisma.package.update({
      where: { id },
      data: { status: 'PICK_UP', pickedUpAt: new Date() },
      include: INCLUDE,
    });
    return res.json(pkg);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Package not found.' });
    return res.status(500).json({ error: 'Failed to check out package.' });
  }
}

module.exports = { getPackages, createPackage, updatePackage, deletePackage, checkoutPackage };
