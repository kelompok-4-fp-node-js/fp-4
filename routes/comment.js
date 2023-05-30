var express = require("express");
var router = express.Router();

const auth = require("../middlewares/auth");
const comment = require("../controllers/comment");

router.get("/", auth, comment.get);
router.post("/", auth, comment.create);
router.put("/:commentId", auth, comment.update);
router.delete("/:commentId", auth, comment.delete);

module.exports = router;
