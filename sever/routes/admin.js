const router = require('express').Router();
const {adminController} = require('../controllers');

//서버 관리자 회원가입
router.post('/signup',adminController.signup.post);
router.post('/login',adminController.login.post);

module.exports= router;