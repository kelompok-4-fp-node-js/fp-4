var express = require("express");
var router = express.Router();

const auth = require("../middlewares/auth");
const user = require("../controllers/user");

router.post('/register', user.register)
router.post('/login',user.login)
router.put('/:id',auth,user.update)
router.delete('/:id',auth,user.delete)

module.exports = router;
