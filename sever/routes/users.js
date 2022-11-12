const router = require('express').Router();
const { usersController } = require('../controllers');


//회원입 가입
router.post('/signup', usersController.signup.post);

// 닉네임 검증
router.get('/check/:nickname', usersController.check.get);

// 인증번호 전송 ( sms )
router.get('/send/?nickname=&email=&phonenumber=', usersController.send.get);

// 인증번호 검증 ( sms )
router.post('/codecheck', usersController.codecheck.post);

// 이메일 찾기
router.get('/emailfind/:nickname/:phonenumber', usersController.emailfind.get);

// 비밀번호 찾기
router.get('/pwfind/:email/:phonenumber', usersController.pwfind.get);

//로그인
router.post('/login', usersController.login.post);

//보유 토큰 양
router.get('/tokens/:usrId', usersController.tokens.get);

// 팔로잉
router.post('/following/:usernickname/:usernickname', usersController.following.post);

// 마이 페이지
router.get('/mypage/:usernickname', usersController.mypage.get);

// 유저 정보 수정
router.post('/update', usersController.update.post);

// 비밀번호 확인
router.post('/pwcheck', usersController.pwcheck.post);

// 비밀번호 수정
router.post('/pwupdate', usersController.pwupdate.post);

// 검색
router.get('/search/:nickname', usersController.search.get);

//로그아웃
router.get('/logout', usersController.logout.get);

// 회원 탈퇴
router.delete('/:usernickname', usersController.delete.delete);

module.exports = router;