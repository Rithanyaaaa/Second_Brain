const router = require('express').Router();
const { getNotes, createNote, updateNote, deleteNote, togglePin } = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getNotes).post(createNote);
router.route('/:id').put(updateNote).delete(deleteNote);
router.patch('/:id/pin', togglePin);

module.exports = router;
