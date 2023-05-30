var express = require("express");
var router = express.Router();

const auth = require("../middlewares/auth");
const sosmed = require("../controllers/SocialMedia");

router.post("/", auth, sosmed.post);
router.get("/", auth, sosmed.get);
router.put("/:id", auth, sosmed.put);
router.delete("/:id", auth, sosmed.delete);

module.exports = router;
