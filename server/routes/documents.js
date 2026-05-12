const router = require('express').Router();
const {
  getDocuments, getDocument, viewDocument,
  downloadDocument, uploadDocument, updateDocument, deleteDocument,
} = require('../controllers/documentsController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// These handle auth via query token — must be before router.use(protect)
router.get('/:id/view', viewDocument);
router.get('/:id/download', downloadDocument);

// All other routes require Authorization header
router.use(protect);
router.route('/').get(getDocuments).post(upload.single('file'), uploadDocument);
router.route('/:id').get(getDocument).put(updateDocument).delete(deleteDocument);

module.exports = router;
