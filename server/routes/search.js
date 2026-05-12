const router = require('express').Router();
const { globalSearch } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, globalSearch);

module.exports = router;
