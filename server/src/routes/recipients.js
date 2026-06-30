const express = require('express');
const router = express.Router();
const { getRecipients, createRecipient, updateRecipient, deleteRecipient } = require('../controllers/recipientController');

router.get('/', getRecipients);
router.post('/', createRecipient);
router.put('/:id', updateRecipient);
router.delete('/:id', deleteRecipient);

module.exports = router;
