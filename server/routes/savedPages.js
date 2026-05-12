const router = require('express').Router();
const { getSavedPages, createSavedPage, updateSavedPage, deleteSavedPage, getFolders } = require('../controllers/savedPagesController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/folders', getFolders);
router.route('/').get(getSavedPages).post(createSavedPage);
router.route('/:id').put(updateSavedPage).delete(deleteSavedPage);

module.exports = router;
