const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadObject, getMyObjects, saveCameraState } = require('../controllers/objectController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', protect, upload.single('model'), uploadObject);
router.get('/my', protect, getMyObjects);
router.put('/:id/camera', protect, saveCameraState);

module.exports = router;