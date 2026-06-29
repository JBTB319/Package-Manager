const prisma = require('../db');

async function getPackages(req, res) {
  const packages = await prisma.package.findMany({ orderBy: { id: 'asc' } });
  res.json(packages);
}

// Until auth is wired up, stamp every check-in with a placeholder user.
// Replace with the authenticated user's id (e.g. req.session.user.id) later.
const CURRENT_USER_ID = 1;

async function createPackage(req, res) {
  const {
    recipientId,
    site,          // enum value: "SITE_1" | "SITE_2" | "SITE_3"
    courier,       // enum value: "USPS" | "UPS" | "FEDEX" | "DHL" | "AMAZON" | "OTHER"
    trackingNum,
    dimensions,
    location,
    notes
  } = req.body;

  // These four are non-nullable in the schema, so guard them up front.
  if (!recipientId || !site || !courier || !location) {
    return res.status(400).json({
      error: 'recipientId, site, courier, and location are required.',
    });
  }

  try {
    const newPackage = await prisma.package.create({
      data: {
        recipient:  { connect: { id: Number(recipientId) } },
        loggedInBy: { connect: { id: CURRENT_USER_ID } },
        site,
        courier,
        location,
        trackingNum: trackingNum || null,
        dimensions:  dimensions || null,
        notes:       notes || null,
        tags:        Array.isArray(tags) ? tags : [],
        // status defaults to RECEIVED and checkedInAt defaults to now() in the schema
      },
      include: {
        recipient: true,
        loggedInBy: true,
      },
    });

    return res.status(201).json(newPackage);
  } catch (error) {
    console.error('Failed to create package', error);
    // Prisma throws P2025 when a connect target doesn't exist (e.g. bad recipientId)
    if (error.code === 'P2025') {
      return res.status(400).json({ error: 'Recipient not found.' });
    }
    return res.status(500).json({ error: 'Failed to create package.' });
  }
}

module.exports = {
  getPackages,
  createPackage,
};
