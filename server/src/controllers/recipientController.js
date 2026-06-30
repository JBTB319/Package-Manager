const prisma = require('../db');

async function getRecipients(req, res) {
  const recipients = await prisma.recipient.findMany({ orderBy: { id: 'asc' } });
  res.json(recipients);
}

async function createRecipient(req, res) {
  const { name, email, site, alias, location, type } = req.body;

  if (!name || !email || !site) {
    return res.status(400).json({ error: 'name, email, and site are required.' });
  }

  try {
    const recipient = await prisma.recipient.create({
      data: {
        name,
        email,
        site,
        alias:    alias    || null,
        location: location || null,
        type:     type     || 'Internal',
      },
    });
    return res.status(201).json(recipient);
  } catch (err) {
    console.error('Failed to create recipient', err);
    if (err.code === 'P2002') return res.status(400).json({ error: 'Email already in use.' });
    return res.status(500).json({ error: 'Failed to create recipient.' });
  }
}

async function updateRecipient(req, res) {
  const id = Number(req.params.id);
  const { name, email, site, alias, location, type } = req.body;

  try {
    const recipient = await prisma.recipient.update({
      where: { id },
      data: {
        ...(name     !== undefined && { name }),
        ...(email    !== undefined && { email }),
        ...(site     !== undefined && { site }),
        ...(alias    !== undefined && { alias:    alias    || null }),
        ...(location !== undefined && { location: location || null }),
        ...(type     !== undefined && { type }),
      },
    });
    return res.json(recipient);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Recipient not found.' });
    if (err.code === 'P2002') return res.status(400).json({ error: 'Email already in use.' });
    return res.status(500).json({ error: 'Failed to update recipient.' });
  }
}

async function deleteRecipient(req, res) {
  const id = Number(req.params.id);
  try {
    await prisma.recipient.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Recipient not found.' });
    return res.status(500).json({ error: 'Failed to delete recipient.' });
  }
}

module.exports = { getRecipients, createRecipient, updateRecipient, deleteRecipient };
