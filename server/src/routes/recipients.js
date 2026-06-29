const express = require('express');
const router = express.Router();
const { getRecipient, createRecipient } = require('../controllers/recipientController');

router.get('/', getRecipient);
router.post('/', createRecipient);

module.exports = router;
