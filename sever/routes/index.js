const router = require("express").Router();

const user = require('./users');
const post = require('./posts');

router.use('/users', user);
router.use('/posts', post);

module.exports = router;
