const prisma = require('../db');

async function getRecipient(req, res) {
  const packages = await prisma.recipient.findMany({ orderBy: { id: 'asc' } });
  res.json(packages);
}

// Until auth is wired up, stamp every check-in with a placeholder user.
// Replace with the authenticated user's id (e.g. req.session.user.id) later.
const CURRENT_USER_ID = 1;

async function createRecipient(req, res) {
  const {
    name,
    email,
    site, // enum value: "SITE_1" | "SITE_2" | "SITE_3"      
  } = req.body;

  // These four are non-nullable in the schema, so guard them up front.
  if (!name || !site || !email) {
    return res.status(400).json({
      error: 'name, email, and site are required.',
    });
  }

  try {
    const newPackage = await prisma.package.create({
      data: {
         name,
         email,
         site
      }
   });

    return res.status(201).json(newPackage);
  } catch (error) {
    console.error('Failed to create recipient', error);
    // Prisma throws P2025 when a connect target doesn't exist (e.g. bad recipientId)
    if (error.code === 'P2025') {
      return res.status(400).json({ error: 'Recipient not found.' });
    }
    return res.status(500).json({ error: 'Failed to create package.' });
  }
}

module.exports = {
  getRecipient,
  createRecipient,
};
