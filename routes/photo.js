var express = require('express');
var router = express.Router();

const auth = require('../middlewares/auth')
const photo = require('../controllers/photo')

router.post('/', auth,photo.post)
router.get('/', auth,photo.get)
router.put('/:id', auth,photo.put)
router.delete('/:id', auth,photo.delete)

module.exports = router;

