const express = require('express');
const router = express.Router();
const { getPackages, createPackage, updatePackage, deletePackage, checkoutPackage } = require('../controllers/packageController');

router.get('/', getPackages);
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);
router.patch('/:id/checkout', checkoutPackage);

module.exports = router;
