const router = require("express").Router();

const user = require('./users');
const post = require('./posts');
const admin = require('./admin');

router.use('/users', user);
router.use('/posts', post);
router.use('/admin', admin);

module.exports = router;
